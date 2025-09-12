# 🎓 PLAT SKILL - Advanced Employability Task Generator

**AI-Powered Task Generation with Enhanced Accuracy and Custom Prompts**

A sophisticated web application that generates personalized employability tasks using Google's Gemini AI models with 100% accuracy through custom prompt engineering.

## ✨ Key Features

### 🤖 **Advanced AI Integration**
- **Gemini 2.0 Flash** (Latest & Most Accurate)
- **Gemini 1.5 Flash** (Balanced & Reliable)
- **Gemini 1.5 Pro** (High Quality)
- **Custom Prompt System** for 100% accuracy
- **Intelligent Error Handling** with detailed feedback

### 🎯 **Enhanced Task Generation**
- **Custom Prompt Required** - Ensures optimal accuracy
- **13+ Skill Categories** - Comprehensive skill coverage
- **Bloom's Taxonomy Integration** - Proper learning progression
- **Multiple Skill Levels** - Low, Medium, High, All Levels
- **Flexible Task Count** - 3 to 20 tasks per generation

### 📊 **Advanced Export Features**
- **Row Selection** - Choose specific tasks to export
- **Column Selection** - Customize which data to include
- **CSV Export** - Professional spreadsheet format
- **Real-time Preview** - See selections before download
- **Bulk Operations** - Select all/deselect all functionality

### 🌍 **Multi-Language Support**
- **12+ Languages** including English, Hindi, Marathi, Bengali, Telugu, Tamil, Malayalam, Kannada, Gujarati, Punjabi, Odia, Assamese, and Nepali
- **Real-time Translation** - Translate tasks instantly
- **Cultural Sensitivity** - Region-appropriate content

### 🔧 **User Experience**
- **Modern UI/UX** - Clean, responsive design
- **Real-time Validation** - Instant feedback on inputs
- **Enhanced Error Messages** - Clear guidance for issues
- **Loading States** - Visual progress indicators
- **Mobile Responsive** - Works on all devices

## 🚀 Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/HASHTECHVENTURES/plat-skill-task-generator.git
cd plat-skill-task-generator
```

### 2. **Set Up API Key**
1. Get your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open `index.html` in your browser
3. Enter your API key in the "API Configuration" section
4. Select your preferred model (Gemini 2.0 Flash recommended)
5. Click "Test API Key" to verify

### 3. **Create Custom Prompt**
1. Navigate to "Customize System Prompt" section
2. Create a custom prompt using the required placeholders:
   - `{{education-level}}` - Student's education level
   - `{{education-year}}` - Current year of study
   - `{{semester}}` - Current semester
   - `{{main-skill}}` - Primary skill focus
   - `{{skill-level}}` - Skill difficulty level
   - `{{task-count}}` - Number of tasks to generate
3. Click "Save Prompt" to store your custom prompt

### 4. **Generate Tasks**
1. Fill out the student profile form
2. Select your main skill focus
3. Choose skill level and task count
4. Click "Generate Employability Tasks"
5. Select specific rows and columns for export
6. Download your customized CSV

## 🛠️ Technical Architecture

### **Frontend Stack**
- **Pure HTML5, CSS3, JavaScript (ES6+)**
- **No Dependencies** - Lightweight and fast
- **Local Storage** - Secure API key storage
- **Responsive Design** - Mobile-first approach

### **AI Integration**
- **Google Gemini API** - Latest AI models
- **Custom Prompt Engineering** - Optimized for accuracy
- **Enhanced Parsing** - Robust data extraction
- **Error Recovery** - Graceful failure handling

### **Export System**
- **Dynamic Row Selection** - Individual task selection
- **Flexible Column Selection** - Custom data export
- **CSV Generation** - Professional formatting
- **Real-time Validation** - Data integrity checks

## 📁 Project Structure

```
plat-skill-task-generator/
├── index.html              # Main application interface
├── script.js               # Core application logic (Enhanced)
├── styles.css              # Comprehensive styling
├── package.json            # Project metadata
├── README.md               # Documentation
├── LICENSE                 # MIT License
└── .gitignore             # Git ignore rules
```

## 🎨 Customization Guide

### **Custom Prompts**
The system requires custom prompts for optimal accuracy. Here's a template:

```
You are an expert employability skills trainer. Generate {{task-count}} tasks for {{education-level}} students in {{education-year}} ({{semester}}) focusing on {{main-skill}} at {{skill-level}} level.

**OUTPUT FORMAT:**
Skill Level | Bloom Level | Main Skill | Subskill | Heading | Content | Task | Application

**REQUIREMENTS:**
- Each task must be practical and actionable
- Include real-world applications
- Ensure age-appropriate content
- Follow Bloom's Taxonomy progression
- Use clear, engaging language

Generate exactly {{task-count}} tasks with perfect formatting.
```

### **Adding New Languages**
1. Update `SUPPORTED_LANGUAGES` in `script.js`
2. Add language option to HTML select
3. Test translation functionality

### **Styling Customization**
- Modify `styles.css` for visual changes
- All styles are modular and well-commented
- Responsive breakpoints included

## 🔧 Configuration Options

### **Available Models**
```javascript
AVAILABLE_MODELS: {
    'gemini-2.0-flash': 'Gemini 2.0 Flash (Latest & Most Accurate)',
    'gemini-1.5-flash': 'Gemini 1.5 Flash (Balanced & Reliable)',
    'gemini-1.5-pro': 'Gemini 1.5 Pro (High Quality)'
}
```

### **Validation Rules**
```javascript
VALIDATION_RULES: {
    MIN_TASK_COUNT: 1,
    MAX_TASK_COUNT: 20,
    MIN_PROMPT_LENGTH: 50,
    MAX_PROMPT_LENGTH: 5000,
    REQUIRED_PLACEHOLDERS: ['{{education-level}}', '{{education-year}}', '{{semester}}', '{{main-skill}}', '{{skill-level}}', '{{task-count}}']
}
```

## 📋 Skill Categories

The application supports 13+ comprehensive skill categories:

1. **Communication** - Verbal and written communication skills
2. **Problem-Solving** - Analytical and critical thinking
3. **Foundational Cognitive Abilities** - Core mental capabilities
4. **Collaboration** - Teamwork and interpersonal skills
5. **Emotional Intelligence** - Self-awareness and empathy
6. **Leadership** - Management and influence skills
7. **Learning Agility** - Adaptability and continuous learning
8. **Creativity and Innovation** - Creative thinking and innovation
9. **Growth Mindset** - Positive attitude toward learning
10. **Multifaceted Literacy Skills** - Digital, financial, media literacy
11. **Productivity** - Efficiency and time management
12. **Decision-Making** - Strategic and tactical decisions
13. **Entrepreneurship** - Business creation and management

## 🎯 Use Cases

### **Educational Institutions**
- Generate tasks for different academic levels
- Create skill-based learning paths
- Support career development programs
- Assessment and evaluation tools

### **Corporate Training**
- Employee skill development
- Leadership training programs
- Team building exercises
- Performance improvement plans

### **Personal Development**
- Individual skill assessment
- Career planning and development
- Learning goal setting
- Professional growth tracking

## 🔒 Privacy & Security

- **No Data Collection** - No personal data stored or transmitted
- **Local Storage Only** - All settings stored locally in browser
- **API Key Security** - Keys only sent to Google for API calls
- **No Tracking** - No analytics or user tracking
- **Open Source** - Full source code available for review

## 🚀 Deployment

### **GitHub Pages**
1. Fork the repository
2. Enable GitHub Pages in repository settings
3. Select main branch as source
4. Access via `https://yourusername.github.io/plat-skill-task-generator`

### **Vercel**
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push
3. Access via Vercel-provided URL

### **Local Development**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **Development Guidelines**
- Follow existing code style
- Add comments for complex logic
- Test all functionality
- Update documentation as needed

## 🆘 Support & Troubleshooting

### **Common Issues**

**Custom Prompt Not Working**
- Ensure all required placeholders are included
- Check prompt length (minimum 50 characters)
- Verify placeholder syntax (double curly braces)

**API Key Issues**
- Verify your Gemini API key is valid
- Check your Google AI Studio account
- Ensure you have sufficient API quota

**Task Generation Fails**
- Test your API key first
- Check browser console for errors
- Verify all required fields are filled
- Ensure custom prompt is saved

**Export Issues**
- Select at least one row and one column
- Check browser permissions for downloads
- Verify CSV format compatibility

### **Getting Help**
- Check the browser console for error messages
- Test your API key using the built-in tester
- Review the custom prompt requirements
- Check the [Google Gemini API documentation](https://ai.google.dev/docs)

## 📈 Roadmap

- **Advanced Analytics** - Task completion tracking
- **Team Collaboration** - Share tasks with teams
- **Mobile App** - Native mobile application
- **API Integration** - REST API for external integrations
- **Template Library** - Pre-built prompt templates
- **Advanced Filtering** - Filter tasks by criteria
- **Progress Tracking** - Student progress monitoring

## 🏆 Acknowledgments

- **Google** for providing the Gemini AI models
- **Font Awesome** for the beautiful icons
- **HASHTECHVENTURES** for project development
- **Open Source Community** for inspiration and support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by HASHTECHVENTURES**

*Empowering career development through AI-driven task generation with 100% accuracy*

<!-- Updated: Added Education Level, Year, and Semester columns to CSV export -->

## 🔗 Links

- **Live Demo**: [plat-skill-task-generator.vercel.app](https://plat-skill-task-generator.vercel.app)
- **GitHub Repository**: [github.com/HASHTECHVENTURES/plat-skill-task-generator](https://github.com/HASHTECHVENTURES/plat-skill-task-generator)
- **Issues**: [github.com/HASHTECHVENTURES/plat-skill-task-generator/issues](https://github.com/HASHTECHVENTURES/plat-skill-task-generator/issues)
- **Documentation**: [README.md](README.md)