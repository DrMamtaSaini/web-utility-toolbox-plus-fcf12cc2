
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Mail,
  Phone,
  Linkedin,
  Github,
  MapPin,
  Plus,
  Trash2,
  Download,
  Printer,
} from "lucide-react";
import { toast } from "sonner";

interface ResumeSection {
  id: string;
  title: string;
  company?: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

const ResumeBrief = () => {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
  });

  const [experience, setExperience] = useState<ResumeSection[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        id: crypto.randomUUID(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setExperience(
      experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter((exp) => exp.id !== id));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: crypto.randomUUID(),
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setEducation(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const addSkill = () => {
    const skillInput = document.getElementById("skillInput") as HTMLInputElement;
    if (skillInput.value.trim()) {
      setSkills([...skills, skillInput.value.trim()]);
      skillInput.value = "";
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleGenerateResume = () => {
    if (!personalInfo.fullName || !personalInfo.email) {
      toast.error("Please fill in at least your full name and email");
      return;
    }
    
    // Prepare the resume for download/print
    if (resumeRef.current) {
      const content = document.createElement('div');
      
      // Create a clean resume for printing/PDF
      content.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="margin-bottom: 5px;">${personalInfo.fullName}</h1>
            ${personalInfo.title ? `<h2 style="margin-top: 0; color: #666;">${personalInfo.title}</h2>` : ''}
          </div>

          <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
            ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
            ${personalInfo.location ? `<div>${personalInfo.location}</div>` : ''}
            ${personalInfo.linkedin ? `<div>${personalInfo.linkedin}</div>` : ''}
            ${personalInfo.github ? `<div>${personalInfo.github}</div>` : ''}
          </div>

          ${personalInfo.summary ? `
            <div style="margin-bottom: 20px;">
              <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Summary</h2>
              <p>${personalInfo.summary}</p>
            </div>
          ` : ''}

          ${experience.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Experience</h2>
              ${experience.map(exp => `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between;">
                    <div>
                      <h3 style="margin-bottom: 0;">${exp.title || 'Position'}</h3>
                      <h4 style="margin-top: 0; font-weight: normal;">${exp.company || 'Company'}</h4>
                    </div>
                    <div style="text-align: right;">
                      <div>${exp.location || ''}</div>
                      <div>${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
                    </div>
                  </div>
                  <p>${exp.description || ''}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${education.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Education</h2>
              ${education.map(edu => `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between;">
                    <div>
                      <h3 style="margin-bottom: 0;">${edu.degree || 'Degree'} in ${edu.fieldOfStudy || 'Field of Study'}</h3>
                      <h4 style="margin-top: 0; font-weight: normal;">${edu.school || 'School/University'}</h4>
                    </div>
                    <div style="text-align: right;">
                      <div>${edu.startDate || ''} - ${edu.endDate || 'Present'}</div>
                    </div>
                  </div>
                  <p>${edu.description || ''}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${skills.length > 0 ? `
            <div>
              <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Skills</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${skills.map(skill => `
                  <div style="background-color: #f3f3f3; padding: 5px 10px; border-radius: 15px;">
                    ${skill}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      // For PDF download, use print functionality
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = content.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handlePrint = () => {
    if (!personalInfo.fullName || !personalInfo.email) {
      toast.error("Please fill in at least your full name and email");
      return;
    }

    handleGenerateResume();
  };

  return (
    <div className="space-y-8" ref={resumeRef}>
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold">Resume Builder</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print/Preview
          </Button>
          <Button onClick={handleGenerateResume}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={personalInfo.fullName}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Software Engineer"
              value={personalInfo.title}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="inline mr-2 h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="inline mr-2 h-4 w-4" />
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+1 234 567 890"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPin className="inline mr-2 h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="New York, NY"
              value={personalInfo.location}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">
              <Linkedin className="inline mr-2 h-4 w-4" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="linkedin.com/in/johndoe"
              value={personalInfo.linkedin}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">
              <Github className="inline mr-2 h-4 w-4" />
              GitHub
            </Label>
            <Input
              id="github"
              name="github"
              placeholder="github.com/johndoe"
              value={personalInfo.github}
              onChange={handlePersonalInfoChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            name="summary"
            placeholder="Write a brief professional summary..."
            value={personalInfo.summary}
            onChange={handlePersonalInfoChange}
          />
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="experience">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) =>
                            updateExperience(exp.id, "title", e.target.value)
                          }
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(exp.id, "company", e.target.value)
                          }
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(exp.id, "startDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) =>
                            updateExperience(exp.id, "endDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(exp.id, "description", e.target.value)
                      }
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addExperience} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>School</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) =>
                            updateEducation(edu.id, "school", e.target.value)
                          }
                          placeholder="University Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(edu.id, "degree", e.target.value)
                          }
                          placeholder="Bachelor's, Master's, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.fieldOfStudy}
                          onChange={(e) =>
                            updateEducation(edu.id, "fieldOfStudy", e.target.value)
                          }
                          placeholder="Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) =>
                            updateEducation(edu.id, "startDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={edu.endDate}
                          onChange={(e) =>
                            updateEducation(edu.id, "endDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={edu.description}
                      onChange={(e) =>
                        updateEducation(edu.id, "description", e.target.value)
                      }
                      placeholder="Describe your academic achievements..."
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addEducation} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Education
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Skills
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input id="skillInput" placeholder="Add a skill" />
                <Button onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <Button onClick={handleGenerateResume} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Generate Resume
        </Button>
      </div>
    </div>
  );
};

export default ResumeBrief;
