import requests
from bs4 import BeautifulSoup

def verify_portfolio(url, skills):
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator=' ').lower()

        # Check skill mentions
        skill_match_count = sum(skill.lower() in text for skill in skills)
        skill_pass = skill_match_count >= len(skills) // 2

        # Check mandatory sections
        required_sections = {
            "projects": ["projects", "portfolio", "work", "my work"],
            "skills": ["skills", "technologies", "stack"],
            "about": ["about me", "about", "bio", "who i am"],
            "contact": ["contact", "get in touch", "reach me"]
        }

        section_pass = True
        for section, keywords in required_sections.items():
            if not any(keyword in text for keyword in keywords):
                print(f"Missing section: {section}")
                section_pass = False

        return section_pass

    except Exception as e:
        print("Verification error:", e)
        return False

