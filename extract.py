from bs4 import BeautifulSoup
import codecs

path_index = r"portfolio-cine/index.html"
with codecs.open(path_index, 'r', 'utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
scripts = soup.find_all('script')
for i, s in enumerate(scripts):
    if s.string:
        with codecs.open(f"test_script_{i}.js", "w", "utf-8") as out:
            out.write(s.string)
