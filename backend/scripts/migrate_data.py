import os
import sys
import json
import uuid
from datetime import date
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment
load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

ID_MAPPING = {
  'student-union': 'sub',
  'rawls-college-of-business': 'rawls-college',
  'holden-hall': 'holden-hall',
  'texas-tech-university-library': 'university-library',
  'administration-building': 'admin-building',
  'english-philosophy-building': 'english-phil',
  'talkington-hall': 'talkington-hall',
  'jones-att-stadium': 'jones-stadium',
  'student-recreation-center': 'student-rec',
  'student-wellness-center': 'student-health',
  'moody-planetarium': 'moody-planetarium'
}

def load_data():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Paths to files
    campus_json_path = os.path.join(current_dir, "ttu-campus.json")
    profile_json_path = os.path.join(current_dir, "universityProfile.json")
    faculty_json_path = os.path.join(current_dir, "facultyDirectory.json")
    
    with open(campus_json_path, "r", encoding="utf-8") as f:
        campus_data = json.load(f)
        
    with open(profile_json_path, "r", encoding="utf-8") as f:
        profile_data = json.load(f)
        
    with open(faculty_json_path, "r", encoding="utf-8") as f:
        faculty_data = json.load(f)
        
    return campus_data, profile_data, faculty_data

def migrate():
    campus_data, profile_data, faculty_data = load_data()
    
    url = settings.DATABASE_URL
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
        
    engine = create_engine(url)
    
    raw_buildings = profile_data.get("buildings", [])
    raw_faculty = faculty_data.get("facultyMembers", [])
    
    ids_seen = set()
    building_slug_to_uuid = {}
    
    print("Migrating buildings...")
    
    # 1. Migrate Buildings
    buildings_inserted = 0
    with engine.connect() as conn:
        for osm_b in campus_data:
            osm_id = osm_b.get("id")
            target_id = ID_MAPPING.get(osm_id, osm_id)
            
            # Deduplicate
            base_id = target_id
            unique_id = base_id
            counter = 1
            while unique_id in ids_seen:
                unique_id = f"{base_id}-{counter}"
                counter += 1
            ids_seen.add(unique_id)
            
            # Generate deterministic UUID
            b_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, unique_id))
            building_slug_to_uuid[unique_id] = b_uuid
            
            # Find matching raw profile
            raw_match = None
            for r in raw_buildings:
                if r.get("id") == target_id or r.get("name", "").lower() == osm_b.get("name", "").lower():
                    raw_match = r
                    break
            
            # Normalize category
            category = osm_b.get("category", "other")
            if raw_match and raw_match.get("category"):
                raw_cat = raw_match.get("category")
                if raw_cat == "administrative":
                    category = "admin"
                elif raw_cat in ["landmark", "health", "museum"]:
                    category = "other"
                else:
                    category = raw_cat
            if category == "administrative":
                category = "admin"
            if category not in ['academic', 'dining', 'parking', 'residence', 'recreation', 'library', 'admin', 'other']:
                category = 'other'
                
            name = (raw_match or {}).get("name") or osm_b.get("name")
            aliases = list(set((osm_b.get("aliases") or []) + ((raw_match or {}).get("aliases") or [])))
            lat = osm_b["coordinates"]["lat"]
            lng = osm_b["coordinates"]["lng"]
            footprint = osm_b.get("footprint")
            entrances = osm_b.get("entrances") or []
            hours = osm_b.get("hours") or {}
            
            # Accessibility
            accessibility_info = osm_b.get("accessibility") or {}
            wheelchair_entrance = accessibility_info.get("wheelchairEntrance") or (raw_match or {}).get("wheelchairAccessible") or False
            elevator_available = accessibility_info.get("elevatorAvailable") or False
            
            # Photos
            photo = (raw_match or {}).get("photo")
            photos = [photo] if photo else []
            
            needs_verification = (raw_match or {}).get("needsReview") or osm_b.get("needsReview") or False
            
            # In case name matches greenhouse/incomplete records
            if "Greenhouse" in name or osm_b.get("officialNumber") == "N/A":
                # Biology Greenhouse was flagged with missing building number
                if "Biology Greenhouse" in name:
                    needs_verification = True
            
            # Execute INSERT OR UPDATE using SQL
            insert_query = text("""
                INSERT INTO buildings (
                    id, slug, official_number, name, aliases, category, latitude, longitude, 
                    footprint, entrances, hours, wheelchair_entrance, elevator_available, photos, 
                    last_verified, needs_verification
                ) VALUES (
                    :id, :slug, :official_number, :name, :aliases, :category, :latitude, :longitude, 
                    :footprint, :entrances, :hours, :wheelchair_entrance, :elevator_available, :photos, 
                    :last_verified, :needs_verification
                )
                ON CONFLICT (slug) DO UPDATE SET
                    official_number = EXCLUDED.official_number,
                    name = EXCLUDED.name,
                    aliases = EXCLUDED.aliases,
                    category = EXCLUDED.category,
                    latitude = EXCLUDED.latitude,
                    longitude = EXCLUDED.longitude,
                    footprint = EXCLUDED.footprint,
                    entrances = EXCLUDED.entrances,
                    hours = EXCLUDED.hours,
                    wheelchair_entrance = EXCLUDED.wheelchair_entrance,
                    elevator_available = EXCLUDED.elevator_available,
                    photos = EXCLUDED.photos,
                    last_verified = EXCLUDED.last_verified,
                    needs_verification = EXCLUDED.needs_verification,
                    updated_at = now()
            """)
            
            conn.execute(insert_query, {
                "id": b_uuid,
                "slug": unique_id,
                "official_number": osm_b.get("officialNumber") or 'N/A',
                "name": name,
                "aliases": aliases,
                "category": category,
                "latitude": lat,
                "longitude": lng,
                "footprint": json.dumps(footprint) if footprint else None,
                "entrances": json.dumps(entrances),
                "hours": json.dumps(hours),
                "wheelchair_entrance": wheelchair_entrance,
                "elevator_available": elevator_available,
                "photos": photos,
                "last_verified": date.today(),
                "needs_verification": needs_verification
            })
            buildings_inserted += 1
        
        conn.commit()
    print(f"Successfully inserted/updated {buildings_inserted} buildings in PostgreSQL.")

    # 2. Migrate Faculty
    print("Migrating faculty...")
    faculty_inserted = 0
    with engine.connect() as conn:
        for f in raw_faculty:
            # Generate deterministic UUID
            f_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f["id"]))
            
            # Map office building slug to its UUID
            office_building_slug = f.get("officeBuildingId")
            office_building_id = None
            if office_building_slug:
                # Find mapped target slug if any
                target_b_slug = ID_MAPPING.get(office_building_slug, office_building_slug)
                # Check if it was generated
                office_building_id = building_slug_to_uuid.get(target_b_slug)
                # If counter suffix was used, match best guess
                if not office_building_id:
                    # Let's search keys in building_slug_to_uuid that start with target_b_slug
                    for slug, b_uuid in building_slug_to_uuid.items():
                        if slug == target_b_slug or slug.startswith(f"{target_b_slug}-"):
                            office_building_id = b_uuid
                            break
            
            # Execute INSERT OR UPDATE using SQL
            insert_faculty_query = text("""
                INSERT INTO faculty (
                    id, full_name, title, department, college, email, phone, 
                    office_building_id, office_room, office_hours, profile_url, 
                    source_department_page, last_verified, needs_verification
                ) VALUES (
                    :id, :full_name, :title, :department, :college, :email, :phone, 
                    :office_building_id, :office_room, :office_hours, :profile_url, 
                    :source_department_page, :last_verified, :needs_verification
                )
                ON CONFLICT (id) DO UPDATE SET
                    full_name = EXCLUDED.full_name,
                    title = EXCLUDED.title,
                    department = EXCLUDED.department,
                    college = EXCLUDED.college,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    office_building_id = EXCLUDED.office_building_id,
                    office_room = EXCLUDED.office_room,
                    office_hours = EXCLUDED.office_hours,
                    profile_url = EXCLUDED.profile_url,
                    source_department_page = EXCLUDED.source_department_page,
                    last_verified = EXCLUDED.last_verified,
                    needs_verification = EXCLUDED.needs_verification,
                    updated_at = now()
            """)
            
            conn.execute(insert_faculty_query, {
                "id": f_uuid,
                "full_name": f.get("fullName"),
                "title": f.get("position"), # position -> title
                "department": f.get("department"),
                "college": "Edward E. Whitacre Jr. College of Engineering" if f.get("department") == "Computer Science" else "College of Arts & Sciences",
                "email": f.get("email"),
                "phone": f.get("officePhone"),
                "office_building_id": office_building_id,
                "office_room": f.get("officeRoom"),
                "office_hours": "N/A",
                "profile_url": f.get("website"),
                "source_department_page": f.get("website") or "static-seed",
                "last_verified": date.today(),
                "needs_verification": f.get("needsReview") or False
            })
            faculty_inserted += 1
            
        conn.commit()
    print(f"Successfully inserted/updated {faculty_inserted} faculty members in PostgreSQL.")

    # 3. Conditional Scraper Seeding
    try:
        with engine.connect() as conn:
            count_result = conn.execute(text("SELECT COUNT(*) FROM faculty"))
            current_count = count_result.scalar() or 0
            print(f"Current faculty count in database: {current_count}")
            
            # If we only have static seeds, run the scraper to fetch live records
            if current_count < 30:
                print("Faculty count is low, running scraper to seed live department data...")
                from scraper.faculty_scraper import scrape_and_update
                scrape_and_update()
            else:
                print("Skipping automatic faculty scraping since database is already populated.")
    except Exception as scrape_err:
        print(f"Failed to run conditional scraping seeding: {scrape_err}")

if __name__ == "__main__":
    migrate()
