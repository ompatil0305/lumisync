import json
import asyncio
import logging
from uuid import uuid4
from services.gemini_service import GeminiService
from services.vector_service import VectorService
from config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rich, comprehensive Texas Tech University knowledge base
CAMPUS_DATA = [
    # 1. IT and Connectivity (IT Help Central)
    {
        "title": "TTU Wi-Fi and Internet Connection Guide",
        "url": "https://www.depts.ttu.edu/ithelpcentral/solutions/wireless.php",
        "source": "IT Help Central",
        "content": "To connect to the official Texas Tech secure wireless network (TTUnet), select 'TTUnet' from your device's Wi-Fi network list. Log in using your TTU eRaider username and password. For guests, select the 'ttu-guest' network, which provides temporary internet access after accepting the terms of use. If you experience issues, contact IT Help Central at (806) 742-4357 (HELP) or ithelpcentral@ttu.edu."
    },
    {
        "title": "eRaider Accounts and Password Reset",
        "url": "https://eraider.ttu.edu",
        "source": "IT Help Central",
        "content": "Your eRaider account is your single sign-on username for all TTU services, including Raiderlink, Blackboard, and email. Passwords must be updated every 90 days. You can change your password, set up multi-factor authentication (MFA) via NetID/Duo, or reset a forgotten password at https://eraider.ttu.edu. If locked out, contact IT Help Central for identity verification."
    },
    
    # 2. Dining and Hospitality Services
    {
        "title": "Student Union Building (SUB) Dining Options",
        "url": "https://www.depts.ttu.edu/hospitality/sub_dining.php",
        "source": "Hospitality Services",
        "content": "The Student Union Building (SUB) is the central campus hub for food. Dining options include Chick-fil-A, Sam's Place SUB (express market), Subway, Pizza Hut, and various local options. Most outlets accept Dining Bucks, credit cards, and cash. Hours vary by semester but typically run from 7:00 AM to 8:00 PM on weekdays."
    },
    {
        "title": "The Market at Stangel/Murdough Hall",
        "url": "https://www.depts.ttu.edu/hospitality/market.php",
        "source": "Hospitality Services",
        "content": "The Market at Stangel/Murdough is one of the largest dining complexes on the TTU campus. It features multiple stations including a fresh salad bar, a hot grill, brick-oven pizza, international foods, and grab-and-go options. The Market offers a 50% discount to students holding a Hospitality Services Dining Plan."
    },
    {
        "title": "Dining Bucks and Meal Plans",
        "url": "https://www.depts.ttu.edu/hospitality/dining_plans.php",
        "source": "Hospitality Services",
        "content": "TTU offers three levels of on-campus dining plans: Matador, Double T, and Red & Black. These plans use 'Dining Bucks', a tax-free debit system loaded onto your RaiderCard. Dining Bucks can be spent at any campus dining location, including food courts, national brands, and Sam's Place mini-markets. Off-campus and commuter dining plans are also available."
    },

    # 3. Housing and Residence Halls
    {
        "title": "TTU Residence Halls List",
        "url": "https://www.depts.ttu.edu/housing/halls/",
        "source": "University Housing",
        "content": "Texas Tech features multiple residence halls including traditional layouts (Chitwood, Weymouth, Coleman, Hulen, Clement, Stangel, Murdough), suite-style rooms (Talkington Hall, Gordon Hall), and apartment-style complexes (West Village). All halls are equipped with Wi-Fi, laundry facilities, study lounges, and 24-hour security desks."
    },
    {
        "title": "University Housing Move-In Guide",
        "url": "https://www.depts.ttu.edu/housing/movein.php",
        "source": "University Housing",
        "content": "For Fall move-in, students must select a specific move-in timeslot through the Housing Portal. Students should bring their RaiderCard (student ID) and pull up to their designated unloading zones. Move-in assistants and volunteers help unload vehicles during official move-in days. Items provided in rooms include a twin XL bed, desk, chair, dresser, and microfridge."
    },

    # 4. Registrar and Academic Calendar
    {
        "title": "Academic Calendar Deadlines (Fall/Spring)",
        "url": "https://www.depts.ttu.edu/officialpublications/calendar/",
        "source": "Office of the Registrar",
        "content": "Important academic dates include: Fall classes begin in late August. The last day to add a class is typically the 4th class day. The last day to drop a class with a 'W' (withdrawal) grade is in late October or early November. Final examinations are held over a 6-day period in early December. Spring classes begin in mid-January, with Spring Break occurring in mid-March."
    },
    {
        "title": "Registration and Add/Drop Process",
        "url": "https://www.depts.ttu.edu/registrar/registration/",
        "source": "Office of the Registrar",
        "content": "Students register for classes online via Raiderlink under the 'Registration' tab. Registration groups are opened in phases based on earned classification hours (Seniors, Juniors, Sophomores, Freshmen). Academic advising is mandatory for most majors before the registration hold is lifted. Add/drop requests after the official deadline require dean's approval."
    },

    # 5. Parking and Transportation
    {
        "title": "Parking Permits and Commuter Parking",
        "url": "https://www.depts.ttu.edu/parking/permits/",
        "source": "Transportation & Parking Services",
        "content": "All vehicles parked on the TTU campus must display a valid parking permit. Commuter permits (e.g., Commuter West near United Supermarkets Arena, Commuter North near Jones AT&T Stadium) grant access to designated lots. Parking is enforced from 7:30 AM to 5:30 PM, Monday through Friday. Visitor parking is available at hourly rates in pay-by-plate lots or garages."
    },
    {
        "title": "Citibus Campus Shuttle Service",
        "url": "https://www.depts.ttu.edu/parking/transportation/",
        "source": "Transportation & Parking Services",
        "content": "Citibus provides free on-campus shuttle services for students. Main routes include the Masked Rider, Double T, Red Raider, and Commuter routes. Shuttles run every 5-10 minutes during weekdays from 7:00 AM to 7:00 PM. Students can track shuttle locations in real-time via the DoubleMap mobile app or site."
    },
    {
        "title": "Raider Ride Safe Night Shuttle",
        "url": "https://www.depts.ttu.edu/parking/transportation/raiderride.php",
        "source": "Transportation & Parking Services",
        "content": "Raider Ride is a night shuttle service providing students safe transportation on and off campus from 6:00 PM to 3:00 AM daily. Rides cost $5 per passenger for off-campus trips and are free for on-campus trips. Students must request rides via the Raider Ride mobile app or by calling (806) 742-7433 (RIDE)."
    },

    # 6. University Library
    {
        "title": "Texas Tech University Library Services",
        "url": "https://www.depts.ttu.edu/library/",
        "source": "University Libraries",
        "content": "The TTU Library is open 24/7 during fall and spring semesters. It features computer labs, collaborative study spaces, a 3D printing makerspace, and the Digital Media Studio where students can check out cameras, recording gear, and laptops. Quiet study floors are located on floors 3, 4, and 5 of the main library building."
    },
    {
        "title": "Study Room Reservations",
        "url": "https://ttu.libcal.com/booking/studyrooms",
        "source": "University Libraries",
        "content": "TTU students can reserve group study rooms in the University Library online up to 7 days in advance. Bookings are limited to 3 hours per day per student. Group study rooms are equipped with dry-erase whiteboards, flatscreen displays, and HDMI inputs. Rooms are intended for groups of 2 or more students."
    },

    # 7. Student Organizations (TechConnect)
    {
        "title": "TechConnect Student Involvement and Clubs",
        "url": "https://ttu.campuslabs.com/engage/",
        "source": "Student Involvement",
        "content": "TechConnect is Texas Tech's official portal for student clubs and involvement. TTU hosts over 450 registered student organizations (RSOs) spanning academic societies, Greek life, sports clubs, advocacy groups, and cultural clubs. Students can search organizations, check event calendars, and join clubs directly at ttu.campuslabs.com/engage/."
    },
    {
        "title": "How to Register a Student Organization (RSO)",
        "url": "https://www.depts.ttu.edu/studentinvolvement/rso/",
        "source": "Student Involvement",
        "content": "To form a new Registered Student Organization (RSO) at TTU, students must: 1. Have at least 5 student members. 2. Have a full-time TTU faculty or staff member serve as advisor. 3. Draft a constitution. 4. Complete the online RSO registration on TechConnect. 5. Have the President, Treasurer, and Advisor complete mandatory RSO training."
    },

    # 8. TTU General Facts and History
    {
        "title": "Texas Tech History, Mascot, and Colors",
        "url": "https://www.ttu.edu/about/",
        "source": "TTU General Info",
        "content": "Founded in 1923, Texas Tech University is a public research university in Lubbock, Texas. The official school colors are Scarlet and Black. The athletic mascot is the Masked Rider, who rides a black horse during football games, alongside Raider Red, the costumed mascot. Notable landmarks include the Memorial Circle, the Will Rogers 'Soapsuds' Statue, and the Administration Building."
    },

    # 9. Departmental Info (CS & Rawls College)
    {
        "title": "Department of Computer Science Office and Advising",
        "url": "https://www.depts.ttu.edu/cs/",
        "source": "Computer Science Dept",
        "content": "The TTU Department of Computer Science offices are located in Holden Hall (Room 244). Dr. Susan Urban serves as the Department Chair. Computer Science undergraduate advising handles course registration, prerequisite overrides, and graduation plans, located in the Holden Hall advising office suite."
    },
    {
        "title": "Jerry S. Rawls College of Business Administration",
        "url": "https://www.depts.ttu.edu/rawlsbusiness/",
        "source": "Rawls College of Business",
        "content": "The Rawls College of Business is located at 1899 Flint Ave. It features state-of-the-art classrooms, the Rawls Career Center, and departments including Accounting, ISQS (Information Systems & Quantitative Sciences), Finance, Marketing, and Management. It is named after alumnus Jerry S. Rawls, who donated $25 million to the college in 2000."
    }
]

async def ingest_data():
    logger.info("Initializing vector database...")
    vector_service = VectorService()
    vector_service.init_db()

    logger.info("Initializing AI service...")
    ai_service = GeminiService()

    documents_to_insert = []

    for item in CAMPUS_DATA:
        logger.info(f"Generating embedding for: {item['title']}")
        try:
            embedding = await ai_service.get_embedding(item['content'])
            doc_id = str(uuid4())
            
            doc = {
                "id": doc_id,
                "content": item['content'],
                "embedding": embedding,
                "metadata": {
                    "title": item['title'],
                    "url": item['url'],
                    "source": item['source'],
                    "university_id": "ttu"
                }
            }
            documents_to_insert.append(doc)
        except Exception as e:
            logger.error(f"Failed to embed {item['title']}: {e}")

    if documents_to_insert:
        logger.info(f"Inserting {len(documents_to_insert)} documents into ttu_knowledge_chunks...")
        # Insert into the new knowledge chunks table
        vector_service.insert_knowledge_chunks(documents_to_insert)
        logger.info("Ingestion complete!")
    else:
        logger.warning("No documents to insert.")

if __name__ == "__main__":
    asyncio.run(ingest_data())
