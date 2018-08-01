﻿var ctMajor = [ 'Architecture and Engineering Occupations',
                'Arts, Design, Entertainment, Sports, and Media Occupations',
                'Building and Grounds Cleaning and Maintenance Occupations',
                'Business and Financial Operations Occupations',
                'Community and Social Service Occupations',
                'Computer and Mathematical Occupations',
                'Construction and Extraction Occupations',
                'Education, Training, and Library Occupations',
                'Farming, Fishing, and Forestry Occupations',
                'Food Preparation and Serving Related Occupations',
                'Healthcare Practitioners and Technical Occupations',
                'Healthcare Support Occupations',
                'Installation, Maintenance, and Repair Occupations',
                'Legal Occupations',
                'Life, Physical, and Social Science Occupations',
                'Management Occupations',
                'Office and Administrative Support Occupations',
                'Personal Care and Service Occupations',
                'Production Occupations',
                'Protective Service Occupations',
                'Sales and Related Occupations',
                'Transportation and Material Moving Occupations'];

var ctMinor = [ "Advertising, Marketing, Promotions, Public Relations, and Sales Managers",
                "Agricultural Workers",
                "Air Transportation Workers",
                "Animal Care and Service Workers",
                "Architects, Surveyors, and Cartographers",
                "Art and Design Workers",
                "Assemblers and Fabricators",
                "Baggage Porters, Bellhops, and Concierges",
                "Building Cleaning and Pest Control Workers",
                "Business Operations Specialists",
                "Communications Equipment Operators",
                "Computer Occupations",
                "Construction Trades Workers",
                "Cooks and Food Preparation Workers",
                "Counselors, Social Workers, and Other Community and Social Service Specialists",
                "Drafters, Engineering Technicians, and Mapping Technicians",
                "Electrical and Electronic Equipment Mechanics, Installers, and Repairers",
                "Engineers",
                "Entertainers and Performers, Sports and Related Workers",
                "Entertainment Attendants and Related Workers",
                "Extraction Workers",
                "Financial Clerks",
                "Financial Specialists",
                "Fire Fighting and Prevention Workers",
                "Fishing and Hunting Workers",
                "Food and Beverage Serving Workers",
                "Food Processing Workers",
                "Forest, Conservation, and Logging Workers",
                "Funeral Service Workers",
                "Grounds Maintenance Workers",
                "Health Diagnosing and Treating Practitioners",
                "Health Technologists and Technicians",
                "Helpers, Construction Trades",
                "Information and Record Clerks",
                "Law Enforcement Workers",
                "Lawyers, Judges, and Related Workers",
                "Legal Support Workers",
                "Librarians, Curators, and Archivists",
                "Life Scientists",
                "Life, Physical, and Social Science Technicians",
                "Material Moving Workers",
                "Material Recording, Scheduling, Dispatching, and Distributing Workers",
                "Mathematical Science Occupations",
                "Media and Communication Equipment Workers",
                "Media and Communication Workers",
                "Metal Workers and Plastic Workers",
                "Motor Vehicle Operators",
                "Nursing, Psychiatric, and Home Health Aides",
                "Occupational Therapy and Physical Therapist Assistants and Aides",
                "Operations Specialties Managers",
                "Other Construction and Related Workers",
                "Other Education, Training, and Library Occupations",
                "Other Food Preparation and Serving Related Workers",
                "Other Healthcare Practitioners and Technical Occupations",
                "Other Healthcare Support Occupations",
                "Other Installation, Maintenance, and Repair Occupations",
                "Other Management Occupations",
                "Other Office and Administrative Support Workers",
                "Other Personal Care and Service Workers",
                "Other Production Occupations",
                "Other Protective Service Workers",
                "Other Sales and Related Workers",
                "Other Teachers and Instructors",
                "Other Transportation Workers",
                "Personal Appearance Workers",
                "Physical Scientists",
                "Plant and System Operators",
                "Postsecondary Teachers",
                "Preschool, Primary, Secondary, and Special Education School Teachers",
                "Printing Workers",
                "Rail Transportation Workers",
                "Religious Workers",
                "Retail Sales Workers",
                "Sales Representatives, Services",
                "Sales Representatives, Wholesale and Manufacturing",
                "Secretaries and Administrative Assistants",
                "Social Scientists and Related Workers",
                "Supervisors of Building and Grounds Cleaning and Maintenance Workers",
                "Supervisors of Construction and Extraction Workers",
                "Supervisors of Farming, Fishing, and Forestry Workers",
                "Supervisors of Food Preparation and Serving Workers",
                "Supervisors of Office and Administrative Support Workers",
                "Supervisors of Personal Care and Service Workers",
                "Supervisors of Production Workers",
                "Supervisors of Protective Service Workers",
                "Supervisors of Sales Workers",
                "Supervisors of Transportation and Material Moving Workers",
                "Textile, Apparel, and Furnishings Workers",
                "Top Executives",
                "Tour and Travel Guides",
                "Vehicle and Mobile Equipment Mechanics, Installers, and Repairers",
                "Water Transportation Workers",
                "Woodworkers"];

var ctEduLevel = ["Less than high school", "High school diploma or equivalent", "Some college, no degree", "Postsecondary non-degree award", "Associate's degree", "Bachelor's degree", "Master's degree", "Doctoral or professional degree"];

var ctEduLevelMod = ["No high school diploma required", "High school diploma or equivalent required", "Some college, no degree required", "Postsecondary non-degree award required", "Associate's degree required", "Bachelor's degree required", "Master's degree required", "Doctoral or professional degree required"];

var ctTraining = ['None', 'Apprenticeship', 'Internship/residency', 'Short-term on-the-job training', 'Moderate-term on-the-job training', 'Long-term on-the-job training'];

var ctExpLevel = ['None', 'Less than 5 years', '5 years or more'];

var ctField = [ "Administrative Support",
                "Agriculture",
                "Air Transportation",
                "Animal Care Services",
                "Architecture and Surveying",
                "Archiving",
                "Art and Design",
                "Automotive Maintenance",
                "Automotive Transportation",
                "Building Maintenance",
                "Business Operations",
                "Cargo Transportation",
                "Client Services",
                "Clothing Production",
                "Communication Equipment Operations",
                "Construction Trades",
                "Culinary Services",
                "Customer Services",
                "Drafting and Sketching",
                "Electrical Maintenace",
                "Electronic Equipment Maintenace",
                "Engineering",
                "Equipment Maintenance",
                "Extraction Equipment Operations",
                "Finance",
                "Financial Administration",
                "Fire Fighting and Prevention",
                "Food Processing",
                "Forestry",
                "Health Care Practice",
                "Healthcare Support",
                "Higher Education",
                "Hospitality Services",
                "Law Enforcement",
                "Legal Services",
                "Legal Support",
                "Life Sciences",
                "Logistics",
                "Machine Operator",
                "Marine Transportation",
                "Marketing and Promotions",
                "Mathematics",
                "Media and Communications",
                "Personal Care Services",
                "Physical Sciences",
                "Plant and System Operation",
                "Pre-College Education",
                "Printing Production",
                "Product Assembly",
                "Production",
                "Protective Services",
                "Sales Services",
                "Science Laboratories",
                "Social Counseling",
                "Social Sciences",
                "Sports and Entertainment",
                "Technology",
                "Train Transportation",
                "Training Others",
                "Transportation Support",
                "Woodworking"];

var ctIndeed = ["administrative assistant",
                "agriculture",
                "pilot or (air traffic)",
                "animal (trainer or caregiver)",
                "architect design -solutions -developer -system -software",
                "archive",
                "art design",
                "vehicle repair",
                "driver",
                "(building maintenance) or cleaning",
                "operations",
                "cargo transportation",
                "client service",
                "clothing",
                "(communication or media) technician",
                "construction",
                "culinary or cook or chef",
                "customer service",
                "drafting technician",
                "electrical equipment",
                "electronics",
                "engineer",
                "equipment repair",
                "extraction equipment operator",
                "financial",
                "financial clerk",
                "fire",
                "food production",
                "forestry",
                "doctor or physician or practitioner",
                "nurse or therapist or assitant or aide",
                "postsecondary teacher",
                "guest service",
                "police officer",
                "lawyer or attorney or judge",
                "legal support",
                "biologist",
                "(material recording) or (shipping clerk)",
                "machine operate",
                "marine -biologist",
                "(marketing manager) or (PR manager) or (sales manager)",
                "mathematic",
                "media or communications or announcer or writer",
                "barber or (hair stylist) or (fitness trainer)",
                "physics chemistry",
                "plant operation",
                "teacher",
                "printing",
                "product assembly",
                "production",
                "(field supervisor) or capitan or guard or investigator",
                "sales",
                "technician",
                "counselor social",
                "social",
                "entertainer",
                "(computer analyst) or (web developer)",
                "train",
                "training",
                "transportation worker",
                "(wood working) or furniture"];

var ctFld = [ "Agriculture",
                "Air Transportation",
                "Animal Care Services",
                "Architecture & Surveying",
                "Art & Design",
                "Business Operations",
                "Cargo & Material Moving",
                "Clothing",
                "Construction",
                "Counseling",
                "Crafts",
                "Education",
                "Equipment Maintenance & Installation",
                "Finance",
                "Food Services",
                "Forestry",
                "Ground Transportation",
                "Healthcare Practice",
                "Healthcare Support",
                "Industrial Production",
                "Insurance",
                "Law Enforcement",
                "Legal Services",
                "Life & Physical Sciences",
                "Logistics",
                "Machine Operation",
                "Manufacturing",
                "Marine Transportation",
                "Marketing & Promotions",
                "Mathematics",
                "Media & Communications",
                "Personal Care Services",
                "Plant & System Operation",
                "Product Assembly",
                "Protective Services",
                "Realestate",
                "Realestate Maintenance",
                "Recreation & Hospitality",
                "Sales",
                "Social Sciences",
                "Sports & Entertainment",
                "Technology",
                "Training Others"];