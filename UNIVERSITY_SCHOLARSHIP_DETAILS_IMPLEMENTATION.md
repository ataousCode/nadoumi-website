# University & Scholarship Details Pages Implementation Plan

## Overview
This document outlines the implementation plan for creating detailed university and scholarship pages with full admin management capabilities for the Nadoumi platform.

## 1. University Detail Page

### 1.1 Page Structure
The university detail page should include:

#### Header/Banner Section:
- **University Logo** (circular/rectangular image)
- **University Name** (large, prominent)
- **Key Information:**
  - City and Province
  - Number of Programs
  - University Type (Public/Private)
- **Ranking Badges** (optional):
  - EDUPRCHINA Application Ranking
  - QS World University Rankings
  - ARWU Rankings
  - Other relevant rankings
- **Note:** "Leave a Message" button is NOT needed

#### Main Content Area:
- **Promotional Video Section:**
  - Video player/embed
  - Expandable/collapsible section
  
- **Navigation Tabs:**
  - Introduction
  - Advantages
  - Albums (photo gallery)
  - Programs (list of available programs)
  - Scholarships (list of available scholarships)
  
- **Basic Information Table:**
  - City
  - Founded in (year)
  - Type (Public/Private)
  - Number of total students
  - Number of international students
  - Number of faculty
  - Other relevant statistics
  
- **About Section:**
  - Rich text description of the university
  - History, achievements, facilities, etc.

### 1.2 Data Model (University Schema)

```javascript
{
  universityId: String (unique),
  name: String (required),
  nameInChinese: String,
  logo: String (image URL),
  city: String,
  province: String,
  type: String (enum: ['Public', 'Private']),
  foundedYear: Number,
  totalStudents: Number,
  internationalStudents: Number,
  facultyCount: Number,
  numberOfPrograms: Number,
  promotionalVideo: String (video URL),
  description: String (rich text),
  advantages: [String] (array of advantage points),
  albums: [{
    title: String,
    images: [String] (array of image URLs)
  }],
  rankings: [{
    name: String,
    value: String,
    icon: String (optional)
  }],
  programs: [ObjectId] (references to Program documents),
  scholarships: [ObjectId] (references to Scholarship documents),
  createdAt: Date,
  updatedAt: Date
}
```

## 2. Scholarship Detail Page

### 2.1 Page Structure

#### Program Details Section:
- **Basic Information:**
  - Field/Category (Engineering, Arts, Science, etc.)
  - Program Name
  - Degree Type (Language, Bachelor, Master, PhD)
  - Duration (years)
  - Intake (e.g., "2026 Autumn")
  - Application Deadline (highlighted in red if approaching)
  
- **Scholarship Information:**
  - Scholarship Type/Category
  - Scholarship Duration
  - Original Tuition Fee
  - Tuition Fee After Scholarship
  - Accommodation Fee (original and after scholarship)
  - Scholarship Policy Details

#### Application Requirements Section:
- **Applicant Requirements:**
  - Age Range (e.g., 18-25 years old)
  - Whether accept students who have been to China (Yes/No)
  - Whether minors are accepted (Yes/No)
  - Acceptable student's current location
  - Score Requirements (e.g., GPA, language test scores)
  - Other specific requirements
  
- **Application Documents:**
  - List of required documents (admin-managed)
  - Each document can have:
    - Name
    - Description/Notes
    - Required (Yes/No)
    - Download link (for forms like Application Form, University Application Form)
    - Special conditions (e.g., "If you have studied in China need Study Certificate")

#### Fee Structure Section:
- **University Fees:**
  - Original Tuition Fee
  - Tuition Fee After Scholarship
  - Accommodation Fee (by room type: Quad, Double, Single)
  - Accommodation Fee After Scholarship
  - Other fees (registration, insurance, etc.)
  
- **Nadoumi Agent Fees:**
  - Application Fee (non-refundable)
  - Service Fee (can vary by agent level)
  - Star Agent Service Fee (viewable after login)

#### Special Notes Section:
- Additional information about fees, policies, requirements
- Important notices

### 2.2 Data Model (Scholarship Schema)

```javascript
{
  scholarshipId: String (unique),
  title: String (required),
  titleInChinese: String,
  university: ObjectId (reference to University),
  
  // Program Information
  programCategory: String (enum: ['Language', 'Bachelor', 'Master', 'PhD']),
  field: String (e.g., 'Engineering', 'Arts', 'Science'),
  programName: String,
  degree: String (e.g., '4 years of Bachelor course'),
  duration: Number (years),
  intake: String (e.g., '2026 Autumn'),
  applicationDeadline: Date,
  
  // Scholarship Information
  scholarshipCategory: String (enum: [
    'Self-funded',
    'Partial',
    'CSC',
    'Province',
    'Universities',
    'HSK',
    'Other'
  ]),
  scholarshipDuration: Number (years),
  originalTuitionFee: Number (RMB/year),
  tuitionFeeAfterScholarship: Number (RMB/year),
  accommodationFee: {
    quad: Number,
    double: Number,
    single: Number
  },
  accommodationFeeAfterScholarship: {
    quad: Number,
    double: Number,
    single: Number
  },
  scholarshipPolicy: String (rich text description),
  
  // Applicant Requirements
  applicantRequirements: {
    ageMin: Number,
    ageMax: Number,
    acceptStudentsBeenToChina: Boolean,
    acceptMinors: Boolean,
    acceptableLocations: [String] (or 'unlimited'),
    scoreRequirements: {
      gpa: Number (optional),
      languageTest: String (optional),
      other: String (optional)
    },
    otherRequirements: String
  },
  
  // Application Documents
  applicationDocuments: [{
    name: String,
    description: String,
    required: Boolean,
    downloadLink: String (optional, for forms),
    specialConditions: String (optional)
  }],
  
  // Fee Structure
  feeStructure: {
    universityFees: {
      originalTuitionFee: Number,
      tuitionFeeAfterScholarship: Number,
      accommodationFees: {
        quad: Number,
        double: Number,
        single: Number
      },
      accommodationFeesAfterScholarship: {
        quad: Number,
        double: Number,
        single: Number
      },
      otherFees: [{
        name: String,
        amount: Number,
        description: String
      }]
    },
    nadoumiFees: {
      applicationFee: Number,
      serviceFee: String (e.g., 'Depend on agent level'),
      starAgentServiceFee: Number (optional, viewable after login)
    }
  },
  
  // Special Notes
  specialNotes: [String],
  
  // Additional Documents (for special cases)
  additionalDocuments: [{
    name: String,
    description: String,
    required: Boolean,
    condition: String (e.g., 'transfer student only', 'if studied in China')
  }],
  
  status: String (enum: ['active', 'inactive', 'draft']),
  createdAt: Date,
  updatedAt: Date
}
```

## 3. Admin Management Interface

### 3.1 University Management

#### Create/Edit University Page:
- **Basic Information Form:**
  - University name (English & Chinese)
  - Logo upload
  - City and Province selection
  - University Type (Public/Private)
  - Founded year
  - Statistics (students, faculty, programs)
  
- **Content Management:**
  - Promotional video URL/upload
  - Rich text editor for description
  - Advantages management (add/remove/edit)
  - Photo albums management (create albums, upload multiple images)
  - Rankings management (add ranking badges with icons)
  
- **Relationships:**
  - Link to programs
  - Link to scholarships

### 3.2 Scholarship Management

#### Create/Edit Scholarship Page:
- **Program Information Section:**
  - Program category dropdown (Language, Bachelor, Master, PhD)
  - Field selection
  - Program name
  - Degree description
  - Duration
  - Intake selection/input
  - Application deadline date picker
  
- **Scholarship Information Section:**
  - Scholarship category dropdown (Self-funded, Partial, CSC, etc.)
  - Scholarship duration
  - Fee calculator/input:
    - Original tuition fee
    - Tuition fee after scholarship
    - Accommodation fees (by room type)
    - Accommodation fees after scholarship
  - Rich text editor for scholarship policy
  
- **Applicant Requirements Section:**
  - Age range (min/max)
  - Checkboxes for:
    - Accept students who have been to China
    - Accept minors
  - Location restrictions (multi-select or "unlimited")
  - Score requirements (GPA, language tests)
  - Additional requirements text area
  
- **Application Documents Section:**
  - Dynamic list of documents
  - For each document:
    - Name input
    - Description/notes textarea
    - Required checkbox
    - Download link input (for forms)
    - Special conditions textarea
  - Add/Remove document functionality
  - Pre-defined document templates (for common documents)
  
- **Fee Structure Section:**
  - University fees inputs
  - Nadoumi fees inputs
  - Special notes textarea
  
- **Additional Documents Section:**
  - For conditional documents (transfer students, students who studied in China, etc.)
  - Similar structure to application documents

### 3.3 Admin Routes

```
/admin/universities
  - GET /admin/universities - List all universities
  - GET /admin/universities/:id - Get university details
  - POST /admin/universities - Create new university
  - PUT /admin/universities/:id - Update university
  - DELETE /admin/universities/:id - Delete university

/admin/scholarships
  - GET /admin/scholarships - List all scholarships
  - GET /admin/scholarships/:id - Get scholarship details
  - POST /admin/scholarships - Create new scholarship
  - PUT /admin/scholarships/:id - Update scholarship
  - DELETE /admin/scholarships/:id - Delete scholarship
```

## 4. Frontend Routes

### 4.1 Public Routes
```
/universities/:id - University detail page
/scholarships/:id - Scholarship detail page
```

### 4.2 Admin Routes
```
/admin/universities - University management list
/admin/universities/new - Create new university
/admin/universities/:id/edit - Edit university
/admin/scholarships - Scholarship management list
/admin/scholarships/new - Create new scholarship
/admin/scholarships/:id/edit - Edit scholarship
```

## 5. Implementation Steps

### Phase 1: Backend Setup
1. Create University model/schema
2. Update Scholarship model/schema (extend existing or create new)
3. Create API routes for universities
4. Create API routes for scholarships
5. Add validation and error handling

### Phase 2: Admin Interface
1. Create University management pages (list, create, edit)
2. Create Scholarship management pages (list, create, edit)
3. Implement rich text editors
4. Implement image/video upload functionality
5. Implement dynamic document list management

### Phase 3: Public Pages
1. Create University detail page component
2. Create Scholarship detail page component
3. Implement tab navigation
4. Implement video player
5. Implement photo gallery
6. Style according to design requirements

### Phase 4: Integration
1. Link universities and scholarships
2. Update navigation/routing
3. Add SEO optimization
4. Add responsive design
5. Testing and bug fixes

## 6. Key Features

### 6.1 Dynamic Document Management
- Admin can add/remove/edit required documents per scholarship
- Documents can have conditions (e.g., "only if studied in China")
- Download links for application forms
- Special notes for each document

### 6.2 Flexible Requirements
- Each scholarship can have different requirements
- Age ranges, location restrictions, score requirements
- All managed by admin per scholarship

### 6.3 Fee Structure Management
- Original fees and post-scholarship fees
- Multiple accommodation types
- Agent fees (with tiered pricing for star agents)

### 6.4 Rich Content Management
- Rich text editors for descriptions
- Image galleries
- Video embeds
- Advantages lists

## 7. Database Considerations

### 7.1 Indexes
- Index on `universityId` and `scholarshipId` for fast lookups
- Index on `programCategory` and `scholarshipCategory` for filtering
- Index on `university` field in scholarships for relationship queries
- Index on `status` for active/inactive filtering

### 7.2 Relationships
- Universities have many Scholarships (one-to-many)
- Scholarships belong to one University (many-to-one)
- Consider denormalization for frequently accessed data

## 8. UI/UX Considerations

### 8.1 Design Consistency
- Match the design style shown in the reference images
- Use red highlighting for important dates/fees
- Clean table layouts for information display
- Responsive design for mobile devices

### 8.2 User Experience
- Clear navigation between sections
- Easy-to-read information hierarchy
- Download buttons for application forms
- Clear indication of required vs optional documents

## 9. Future Enhancements

- Comparison feature (compare multiple scholarships)
- Favorites/bookmarking
- Application tracking integration
- Multi-language support (English/Chinese)
- Search and filter functionality
- Analytics tracking

## 10. Notes

- All content is fully managed by admin
- No "Leave a Message" button needed
- Requirements and documents can differ per university/scholarship
- Support for various scholarship categories
- Support for all program categories (Language, Bachelor, Master, PhD)

