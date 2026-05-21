.PHONY: resume clean-resume

# Rebuild the resume PDF from resume.md + resume.css.
# Requires: pandoc, weasyprint  (sudo apt install pandoc weasyprint)
resume: JBreitreiter_Resume.pdf

JBreitreiter_Resume.pdf: resume.md resume.css
	pandoc -s --css resume.css --metadata title="Joseph Breitreiter — Resume" -o resume.html $<
	weasyprint resume.html $@
	rm -f resume.html

clean-resume:
	rm -f resume.html JBreitreiter_Resume.pdf
