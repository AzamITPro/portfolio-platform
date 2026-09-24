import os

search_str = "http://127.0.0.1:8000"
replace_str = "https://portfolio-backend-kofh.onrender.com"

count = 0
for root, _, files in os.walk("frontend/src"):
    for file in files:
        if file.endswith((".ts", ".tsx")):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            if search_str in content:
                new_content = content.replace(search_str, replace_str)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"[✓] Updated: {filepath}")
                count += 1

print(f"\n[+] Success: Replaced local URL with Render cloud URL across {count} frontend files!")