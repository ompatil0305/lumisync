import os
import sys
import re
import json
import uuid
import time
from datetime import date
import httpx
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, text

# Load config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

SCRAPE_TARGETS = [
    {
        "url": "https://www.depts.ttu.edu/cs/faculty/",
        "college": "Edward E. Whitacre Jr. College of Engineering",
        "department": "Computer Science",
        "type": "vue_json"
    },
    {
        "url": "https://www.depts.ttu.edu/rawlsbusiness/people/faculty/accounting/",
        "college": "Jerry S. Rawls College of Business Administration",
        "department": "Accounting",
        "type": "vue_json"
    },
    {
        "url": "https://www.depts.ttu.edu/rawlsbusiness/people/faculty/finance/",
        "college": "Jerry S. Rawls College of Business Administration",
        "department": "Finance",
        "type": "vue_json"
    },
    {
        "url": "https://www.depts.ttu.edu/rawlsbusiness/people/faculty/isqs/",
        "college": "Jerry S. Rawls College of Business Administration",
        "department": "ISQS",
        "type": "vue_json"
    },
    {
        "url": "https://www.depts.ttu.edu/chemistry/contacts/faculty.php",
        "college": "College of Arts & Sciences",
        "department": "Chemistry & Biochemistry",
        "type": "chemistry_table"
    }
]

def clean_value(val):
    if not val or str(val).strip().lower() in ["none", "null", "undefined", ""]:
        return None
    return str(val).strip()

def parse_office_info(summary):
    if not summary:
        return None, None
    
    # Try finding office info in summary
    # Format e.g.: "Office:EC 306D", "Office: 316", "Room Number:EC 315"
    office_match = re.search(r'(?:Office|Room Number|Room)\s*:\s*([A-Za-z0-9-\s]+)', summary, re.IGNORECASE)
    if office_match:
        room_raw = office_match.group(1).strip()
        # Extract EC or similar prefix
        building_guess = None
        if room_raw.upper().startswith("EC"):
            building_guess = "Engineering Center" # or Electrical Engineering
        elif room_raw.upper().startswith("BA") or "RAWLS" in summary.upper():
            building_guess = "Rawls College of Business"
        return room_raw, building_guess
    return None, None

def scrape_and_update():
    url = settings.DATABASE_URL
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
        
    engine = create_engine(url)
    
    # Fetch buildings mapping to match office_building_id
    building_slug_to_uuid = {}
    building_name_to_uuid = {}
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, slug, name FROM buildings"))
        for row in result:
            building_slug_to_uuid[row[1]] = row[0]
            building_name_to_uuid[row[2].lower()] = row[0]
            
    print(f"Loaded {len(building_slug_to_uuid)} buildings from DB for relationship mapping.")

    scraped_count = 0
    
    headers = {
        "User-Agent": "LumiSync-Scraper/1.0 (+https://lumisync-production.up.railway.app)"
    }
    
    for target in SCRAPE_TARGETS:
        print(f"Scraping department: {target['department']} from {target['url']}...")
        try:
            response = httpx.get(target["url"], headers=headers, timeout=20.0, follow_redirects=True)
            if response.status_code != 200:
                print(f"Failed to fetch {target['url']}, status: {response.status_code}")
                continue
                
            soup = BeautifulSoup(response.text, "html.parser")
            faculty_members = []
            
            if target["type"] == "vue_json":
                # Find Vue JSON block
                scripts = soup.find_all("script")
                vue_data_str = None
                for script in scripts:
                    if script.string and "items:" in script.string:
                        # Extract the array inside items: [...]
                        match = re.search(r'items:\s*(\[[\s\S]*?\]),\s*opts:', script.string)
                        if match:
                            vue_data_str = match.group(1)
                            break
                            
                if vue_data_str:
                    try:
                        # Sometimes key/values are not quoted or single quoted, clean them up or load using JSON parser
                        # Let's clean up JS style dictionary format to valid JSON
                        # Replace JS escaped single quotes
                        cleaned_str = vue_data_str.replace("\\'", "'")
                        # Try parsing it directly
                        parsed_json = json.loads(cleaned_str)
                        faculty_members = parsed_json
                    except Exception as json_err:
                        print(f"Failed to parse Vue JSON string with standard json, trying regex cleanup: {json_err}")
                        # Simple regex cleanup for JS objects
                        cleaned_str = re.sub(r'(\b\w+\b)\s*:', r'"\1":', vue_data_str) # quote keys
                        cleaned_str = cleaned_str.replace("'", '"') # convert single to double quotes
                        cleaned_str = re.sub(r',\s*\]', ']', cleaned_str) # remove trailing commas
                        cleaned_str = re.sub(r',\s*\}', '}', cleaned_str)
                        try:
                            faculty_members = json.loads(cleaned_str)
                        except Exception as final_err:
                            print(f"Regex cleanup failed to parse: {final_err}")
                            continue
                else:
                    print(f"Could not find Vue items block on page {target['url']}")
                    continue
                    
            elif target["type"] == "chemistry_table":
                # Chemistry Table layout
                # Find all td visible-for-small-only
                cells = soup.find_all("td", class_="visible-for-small-only")
                for cell in cells:
                    strong = cell.find("strong")
                    if not strong:
                        continue
                    a_tag = strong.find("a")
                    if not a_tag:
                        continue
                        
                    name_raw = clean_value(a_tag.text)
                    if not name_raw:
                        continue
                    
                    # Split "Quitevis, Edward L." -> "Edward L. Quitevis"
                    if "," in name_raw:
                        parts = name_raw.split(",")
                        full_name = f"{parts[1].strip()} {parts[0].strip()}"
                    else:
                        full_name = name_raw
                        
                    profile_url = clean_value(a_tag.get("href"))
                    if profile_url and not profile_url.startswith("http"):
                        profile_url = "https://www.depts.ttu.edu" + profile_url
                        
                    # Find title (next em tag)
                    em = cell.find("em")
                    title = clean_value(em.text) if em else "Faculty"
                    
                    # Find email (next a.mail tag)
                    mail_tag = cell.find("a", class_="mail")
                    email = None
                    if mail_tag:
                        email = clean_value(mail_tag.get("href"))
                        if email and email.startswith("mailto:"):
                            email = email.replace("mailto:", "")
                            
                    # Chemistry building is default for chemistry department
                    faculty_members.append({
                        "full_name": full_name,
                        "jobtitle": title,
                        "email": email,
                        "phone": "806.742.3067", # central chemistry dept phone default
                        "profile_url": profile_url,
                        "office_room": "Chemistry Building",
                        "summary": "Office: Chemistry Building"
                    })
            
            # Now insert or update DB
            print(f"Parsed {len(faculty_members)} records from {target['department']}.")
            
            with engine.connect() as conn:
                for f in faculty_members:
                    # Resolve fields
                    first_name = clean_value(f.get("firstname"))
                    last_name = clean_value(f.get("lastname"))
                    full_name = clean_value(f.get("full_name"))
                    
                    if not full_name and first_name and last_name:
                        full_name = f"{first_name} {last_name}"
                        
                    if not full_name:
                        continue
                        
                    title = clean_value(f.get("jobtitle")) or "Faculty"
                    email = clean_value(f.get("email"))
                    phone = clean_value(f.get("phone"))
                    
                    summary = clean_value(f.get("summary"))
                    room, b_guess = parse_office_info(summary)
                    
                    if not room:
                        room = clean_value(f.get("office_room"))
                        
                    profile_url = clean_value(f.get("profile_url"))
                    if not profile_url and f.get("fullpagepath"):
                        path_suffix = f.get("fullpagepath")
                        if path_suffix.startswith("/"):
                            profile_url = "https://www.depts.ttu.edu" + path_suffix
                        else:
                            profile_url = "https://www.depts.ttu.edu/" + path_suffix
                            
                    # Map building ID
                    office_building_id = None
                    needs_verification = False
                    
                    # Fallback to defaults by department
                    if target["department"] == "Computer Science":
                        # CS offices are in Holden Hall or Engineering Center
                        office_building_id = building_slug_to_uuid.get("holden-hall")
                    elif target["department"] in ["Accounting", "Finance", "ISQS"]:
                        # Rawls building
                        office_building_id = building_slug_to_uuid.get("rawls-college")
                    elif target["department"] == "Chemistry & Biochemistry":
                        # Chemistry Building
                        office_building_id = building_name_to_uuid.get("chemistry building") or building_slug_to_uuid.get("chemistry-building")
                        
                    # If we parsed a specific building guess
                    if b_guess:
                        guess_uuid = building_name_to_uuid.get(b_guess.lower())
                        if guess_uuid:
                            office_building_id = guess_uuid
                            
                    # Flags
                    if not email or not room:
                        needs_verification = True
                        
                    # Deterministic UUID
                    f_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{full_name}:{email or 'unknown'}"))
                    
                    # Insert or update
                    insert_query = text("""
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
                            profile_url = EXCLUDED.profile_url,
                            source_department_page = EXCLUDED.source_department_page,
                            last_verified = EXCLUDED.last_verified,
                            needs_verification = EXCLUDED.needs_verification,
                            updated_at = now()
                    """)
                    
                    conn.execute(insert_query, {
                        "id": f_uuid,
                        "full_name": full_name,
                        "title": title,
                        "department": target["department"],
                        "college": target["college"],
                        "email": email,
                        "phone": phone,
                        "office_building_id": office_building_id,
                        "office_room": room or "N/A",
                        "office_hours": "N/A",
                        "profile_url": profile_url,
                        "source_department_page": target["url"],
                        "last_verified": date.today(),
                        "needs_verification": needs_verification
                    })
                    scraped_count += 1
                
                conn.commit()
                
            # Rate limit respect
            time.sleep(1.5)
            
        except Exception as scrap_err:
            print(f"Error scraping {target['department']}: {scrap_err}")
            
    print(f"Faculty scraper completed. Updated {scraped_count} records in Supabase.")

if __name__ == "__main__":
    scrape_and_update()
