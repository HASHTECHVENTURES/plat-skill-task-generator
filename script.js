/**
 * PLAT SKILL - Advanced Employability Task Generator
 * AI-Powered Task Generation with Enhanced Accuracy
 * Version: 2.0.0
 * Author: HASHTECHVENTURES
 */

// Enhanced Configuration
const CONFIG = {
    // Gemini API Configuration
    GEMINI_API_KEYS: [
        '',  // Primary key - will be loaded from localStorage
        ''   // Secondary key - will be loaded from localStorage
    ],
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    
    // Available Gemini Models with enhanced descriptions
    AVAILABLE_MODELS: {
        'gemini-2.0-flash': 'Gemini 2.0 Flash (Latest & Most Accurate)',
        'gemini-1.5-flash': 'Gemini 1.5 Flash (Balanced & Reliable)',
        'gemini-1.5-pro': 'Gemini 1.5 Pro (High Quality)'
    },
    
    // Default model
    DEFAULT_MODEL: 'gemini-2.0-flash',
    
    // Required form fields
    REQUIRED_FIELDS: ['education-level', 'education-year', 'semester', 'main-skill', 'skill-level', 'task-count'],
    
    // Enhanced language support
    SUPPORTED_LANGUAGES: {
        'en': 'English',
        'hi': 'Hindi',
        'mr': 'Marathi',
        'bn': 'Bengali',
        'te': 'Telugu',
        'ta': 'Tamil',
        'ml': 'Malayalam',
        'kn': 'Kannada',
        'gu': 'Gujarati',
        'pa': 'Punjabi',
        'or': 'Odia',
        'as': 'Assamese',
        'ne': 'Nepali'
    },
    
    
    // Enhanced validation rules
    VALIDATION_RULES: {
        MIN_TASK_COUNT: 1,
        MAX_TASK_COUNT: 20,
        MIN_PROMPT_LENGTH: 50,
        MAX_PROMPT_LENGTH: 5000,
        REQUIRED_PLACEHOLDERS: ['{{education-level}}', '{{education-year}}', '{{semester}}', '{{main-skill}}', '{{skill-level}}', '{{task-count}}']
    }
};

// Load saved API keys on startup
function loadConfigFromStorage() {
    const savedGeminiKey1 = localStorage.getItem('geminiApiKey1');
    const savedGeminiKey2 = localStorage.getItem('geminiApiKey2');
    const savedModel = localStorage.getItem('selectedModel');
    
    if (savedGeminiKey1) {
        CONFIG.GEMINI_API_KEYS[0] = savedGeminiKey1;
    }
    if (savedGeminiKey2) {
        CONFIG.GEMINI_API_KEYS[1] = savedGeminiKey2;
    }
    if (savedModel && CONFIG.AVAILABLE_MODELS[savedModel]) {
        CONFIG.DEFAULT_MODEL = savedModel;
    }
}

// DOM Elements
const DOM = {
    form: null,
    loadingDiv: null,
    resultsDiv: null,
    tasksTableBody: null,
    newTasksBtn: null,
    downloadExcelBtn: null,
    translateTasksBtn: null,
    preferredLanguageSelect: null,
    geminiApiKeyInput: null,
    geminiModelSelect: null,
    testGeminiApiBtn: null,
    saveGeminiConfigBtn: null,
    toggleApiKeyBtn: null,
    apiStatus: null,
    generateTasksBtn: null,
    selectColumnsBtn: null,
    columnSelectionModal: null,
    downloadSelectedColumnsBtn: null,
    selectAllColumnsBtn: null,
    deselectAllColumnsBtn: null,
    selectAllRowsCheckbox: null,
    selectedRowsCount: null,
    
    init() {
        this.form = document.getElementById('taskForm');
        this.loadingDiv = document.getElementById('loading');
        this.resultsDiv = document.getElementById('results');
        this.tasksTableBody = document.getElementById('tasksTableBody');
        this.newTasksBtn = document.getElementById('newTasks');
        this.downloadExcelBtn = document.getElementById('downloadExcel');
        this.translateTasksBtn = document.getElementById('translateTasks');
        this.preferredLanguageSelect = document.getElementById('preferred-language');
        
        
        // API Configuration elements
        this.geminiApiKeyInput = document.getElementById('gemini-api-key');
        this.geminiModelSelect = document.getElementById('gemini-model');
        this.testGeminiApiBtn = document.getElementById('test-gemini-api');
        this.saveGeminiConfigBtn = document.getElementById('save-gemini-config');
        this.toggleApiKeyBtn = document.getElementById('toggle-api-key');
        this.apiStatus = document.getElementById('api-status');
        this.generateTasksBtn = document.getElementById('generateTasksBtn');
        this.selectColumnsBtn = document.getElementById('selectColumns');
        this.columnSelectionModal = document.getElementById('columnSelectionModal');
        this.downloadSelectedColumnsBtn = document.getElementById('downloadSelectedColumns');
        this.selectAllColumnsBtn = document.getElementById('selectAllColumns');
        this.deselectAllColumnsBtn = document.getElementById('deselectAllColumns');
        this.selectAllRowsCheckbox = document.getElementById('selectAllRows');
        this.selectedRowsCount = document.getElementById('selectedRowsCount');
    }
};

// Initialize application
function initApp() {
    console.log('Initializing PLAT SKILL Gemini application...');
    
    // Load saved API keys first
    loadConfigFromStorage();
    
    // Initialize DOM elements
    DOM.init();
    
    // Load API configuration
    loadApiConfiguration();
    
    // Add form event listener
    if (DOM.form) {
        DOM.form.addEventListener('submit', handleFormSubmit);
    }
    
    // Add other event listeners
    addEventListeners();
    
    // Initialize prompt management
    initializePromptManagement();
    
    console.log('PLAT SKILL Gemini application initialized successfully!');
}

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        // Validate form
        const formData = new FormData(DOM.form);
        const data = Object.fromEntries(formData.entries());
        
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading
        showLoading();
        
        // Generate tasks
        const result = await generateEmployabilityTasks(data);
        
        // Display results
        await displayResults(result);
        
    } catch (error) {
        console.error('Error generating tasks:', error);
            displayError(getErrorMessage(error));
    }
}

// Form validation
function validateForm(data) {
    for (const field of CONFIG.REQUIRED_FIELDS) {
        if (!data[field] || data[field].trim() === '') {
            displayError(`Please fill in the ${field.replace('-', ' ')} field.`);
            return false;
        }
    }
    return true;
}

// Generate employability tasks using Gemini
async function generateEmployabilityTasks(studentData) {
    try {
        // Create custom prompt
        const prompt = createEmployabilityPrompt(studentData);
        
        // Call Gemini API
        const response = await callGeminiAPI(prompt);
        
        // Parse response
        const result = parseEmployabilityTasks(response, studentData);
        
        return result;
        
    } catch (error) {
        console.error('Task generation failed:', error);
        throw new Error(`Task generation failed: ${error.message}`);
    }
}

// Call Gemini API
async function callGeminiAPI(prompt, model = CONFIG.DEFAULT_MODEL) {
    const apiKey = CONFIG.GEMINI_API_KEYS[0] || CONFIG.GEMINI_API_KEYS[1];
    
    if (!apiKey) {
        throw new Error('No Gemini API key found. Please add your API key.');
    }
    
    const modelUrl = CONFIG.AVAILABLE_MODELS[model] ? 
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}` :
        `${CONFIG.GEMINI_API_URL}?key=${apiKey}`;
    
    const response = await fetch(modelUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
        }

        const data = await response.json();
        
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
}

// Enhanced custom prompt system - CUSTOM PROMPT ONLY
function createEmployabilityPrompt(data) {
    // Get custom prompt - MANDATORY
    const customPrompt = localStorage.getItem('customPrompt');
    
    if (!customPrompt || customPrompt.trim().length < CONFIG.VALIDATION_RULES.MIN_PROMPT_LENGTH) {
        throw new Error('No custom prompt found or prompt too short. Please create and save a custom prompt first. The system requires a custom prompt for optimal accuracy.');
    }
    
    // Enhanced validation with detailed feedback
    const validation = validatePromptCompleteness(customPrompt, data);
    if (!validation.isValid) {
        throw new Error(`Custom prompt validation failed: ${validation.error}. Please check your custom prompt and ensure it includes all required placeholders.`);
    }
    
    // Process prompt with enhanced data replacement
    const processedPrompt = processPromptWithData(customPrompt, data);
    
    // Add quality enhancement instructions for better accuracy
    const enhancedPrompt = addQualityEnhancements(processedPrompt, data);
    
    // Log the processed prompt for debugging
    console.log('Using CUSTOM PROMPT - Processed preview:', enhancedPrompt.substring(0, 300) + '...');
    
    return enhancedPrompt;
}

// Enhanced prompt validation
function validatePromptCompleteness(prompt, data) {
    const requiredPlaceholders = CONFIG.VALIDATION_RULES.REQUIRED_PLACEHOLDERS;
    const missingPlaceholders = requiredPlaceholders.filter(placeholder => !prompt.includes(placeholder));
    
    if (missingPlaceholders.length > 0) {
        return {
            isValid: false,
            error: `Missing required placeholders: ${missingPlaceholders.join(', ')}`
        };
    }
    
    // Check prompt length
    if (prompt.length < CONFIG.VALIDATION_RULES.MIN_PROMPT_LENGTH) {
        return {
            isValid: false,
            error: `Prompt too short. Minimum ${CONFIG.VALIDATION_RULES.MIN_PROMPT_LENGTH} characters required`
        };
    }
    
    if (prompt.length > CONFIG.VALIDATION_RULES.MAX_PROMPT_LENGTH) {
        return {
            isValid: false,
            error: `Prompt too long. Maximum ${CONFIG.VALIDATION_RULES.MAX_PROMPT_LENGTH} characters allowed`
        };
    }
    
    return { isValid: true };
}

// Enhanced data processing with validation
function processPromptWithData(prompt, data) {
    // Validate data completeness
    const missingFields = CONFIG.REQUIRED_FIELDS.filter(field => !data[field] || data[field].trim() === '');
    if (missingFields.length > 0) {
        throw new Error(`Missing required data: ${missingFields.join(', ')}`);
    }
    
    // Process prompt with data replacement
    let processedPrompt = prompt;
    
    // Replace all placeholders with actual data
    Object.keys(data).forEach(key => {
        const placeholder = `{{${key}}}`;
        const value = data[key] || 'N/A';
        processedPrompt = processedPrompt.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return processedPrompt;
}

// Add quality enhancements to prompt
function addQualityEnhancements(prompt, data) {
    const enhancements = [
        '\n\n**FINAL INSTRUCTIONS:**',
        '1. Ensure 100% accuracy in table formatting',
        '2. Each row must have exactly 8 columns separated by |',
        '3. Use clear, professional language',
        '4. Make tasks practical and actionable',
        '5. Include specific examples and scenarios',
        `6. Generate exactly ${data['task-count']} tasks`,
        '7. Double-check formatting before responding',
        '\n**OUTPUT FORMAT VERIFICATION:**',
        'Skill Level | Bloom Level | Main Skill | Subskill | Heading | Content | Task | Application',
        '\nGenerate the table now with perfect formatting.'
    ];
    
    return prompt + enhancements.join('\n');
}

// Enhanced parsing function with improved accuracy
function parseEmployabilityTasks(text, studentData) {
    const tasks = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    console.log('Parsing AI response...', lines.length, 'lines found');
    
    for (const line of lines) {
        // Enhanced line filtering for better accuracy
        if (isValidTaskLine(line)) {
            const columns = parseTaskLine(line);
            
            if (columns && columns.length >= 6) {
                const task = {
                    skillLevel: cleanText(columns[0]) || 'N/A',
                    bloomLevel: cleanText(columns[1]) || 'N/A',
                    mainSkill: cleanText(columns[2]) || 'N/A',
                    subskill: cleanText(columns[3]) || 'N/A',
                    heading: cleanText(columns[4]) || 'N/A',
                    content: cleanText(columns[5]) || 'N/A',
                    task: cleanText(columns[6]) || 'N/A',
                    application: cleanText(columns[7]) || 'N/A'
                };
                
                // Validate task quality
                if (isValidTask(task)) {
                    tasks.push(task);
                }
            }
        }
    }
    
    console.log(`Successfully parsed ${tasks.length} tasks`);
    
    return {
        studentData,
        tasks: tasks
    };
}

// Enhanced line validation
function isValidTaskLine(line) {
    // Check if line contains pipe separators
    if (!line.includes('|')) return false;
    
    // Skip header lines and separator lines
    if (line.includes('Skill Level') || line.includes('---') || line.includes('===')) return false;
    
    // Skip lines that are too short (likely not task data)
    if (line.length < 20) return false;
    
    // Check for minimum number of columns
    const columnCount = (line.match(/\|/g) || []).length;
    return columnCount >= 5; // At least 6 columns (5 separators)
}

// Enhanced line parsing with better error handling
function parseTaskLine(line) {
    try {
        // Split by pipe and clean each column
        const columns = line.split('|').map(col => col.trim());
        
        // Filter out empty columns at the end
        while (columns.length > 0 && !columns[columns.length - 1]) {
            columns.pop();
        }
        
        return columns;
    } catch (error) {
        console.error('Error parsing line:', line, error);
        return null;
    }
}

// Clean and validate text content
function cleanText(text) {
    if (!text) return '';
    
    // Remove extra whitespace and clean up
    let cleaned = text.trim();
    
    // Remove common formatting artifacts
    cleaned = cleaned.replace(/^\*+|\*+$/g, ''); // Remove asterisks
    cleaned = cleaned.replace(/^\-+|\-+$/g, ''); // Remove dashes
    cleaned = cleaned.replace(/^#+\s*/, ''); // Remove markdown headers
    
    return cleaned;
}

// Validate task quality
function isValidTask(task) {
    // Check if essential fields have meaningful content
    const hasEssentialContent = task.heading && task.heading !== 'N/A' && task.heading.length > 3;
    const hasTaskContent = task.task && task.task !== 'N/A' && task.task.length > 10;
    
    return hasEssentialContent && hasTaskContent;
}

// Display results in table format
async function displayResults(data) {
    DOM.loadingDiv.classList.add('hidden');
    
    if (!data.tasks || data.tasks.length === 0) {
        displayError('No tasks received from AI. Please try again.');
        return;
    }
    
    // Store original tasks
    window.originalTasks = data.tasks;
    
    // Check if translation is needed
    const selectedLanguage = DOM.preferredLanguageSelect?.value || 'en';
    
    if (selectedLanguage === 'en') {
        // Show in English
        populateTasksTable(data.tasks);
    } else {
        // Translate to selected language
        try {
            const translatedTasks = await translateTasks(data.tasks, selectedLanguage);
            populateTasksTable(translatedTasks);
        } catch (error) {
            console.error('Translation failed:', error);
            // Fallback to English
            populateTasksTable(data.tasks);
        }
    }
    
    DOM.resultsDiv.classList.remove('hidden');
    DOM.resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Populate tasks table
function populateTasksTable(tasks) {
    DOM.tasksTableBody.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="row-checkbox" data-index="${index}" data-task-id="${index}">
            </td>
            <td><span class="skill-level ${task.skillLevel.toLowerCase()}">${task.skillLevel}</span></td>
            <td><span class="bloom-level">${task.bloomLevel || 'N/A'}</span></td>
            <td>${task.mainSkill || 'N/A'}</td>
            <td>${task.subskill || 'N/A'}</td>
            <td><strong>${task.heading || 'N/A'}</strong></td>
            <td>${task.content || 'N/A'}</td>
            <td>${task.task || 'N/A'}</td>
            <td>${task.application || 'N/A'}</td>
        `;
        DOM.tasksTableBody.appendChild(row);
    });
    
    // Add event listeners for row checkboxes
    addRowSelectionListeners();
    updateSelectedRowsCount();
}

// Translation functions
async function translateTasks(tasks, targetLanguage) {
    try {
        if (targetLanguage === 'en') {
            return tasks;
        }
        
        const translatedTasks = [];
        
        for (const task of tasks) {
            const translatedTask = {
                skillLevel: task.skillLevel,
                bloomLevel: task.bloomLevel,
                mainSkill: await translateText(task.mainSkill, targetLanguage),
                subskill: await translateText(task.subskill, targetLanguage),
                heading: await translateText(task.heading, targetLanguage),
                content: await translateText(task.content, targetLanguage),
                task: await translateText(task.task, targetLanguage),
                application: await translateText(task.application, targetLanguage)
            };
            translatedTasks.push(translatedTask);
        }
        
        return translatedTasks;
        
    } catch (error) {
        console.error('Translation failed:', error);
        throw error;
    }
}

async function translateText(text, targetLanguage) {
    try {
        if (targetLanguage === 'en') {
            return text;
        }
        
        const prompt = `Translate the following text to ${CONFIG.SUPPORTED_LANGUAGES[targetLanguage]}. Only return the translation, no additional text:\n\n${text}`;
        
        const response = await callGeminiAPI(prompt);
        return response.trim();
        
    } catch (error) {
        console.error('Text translation failed:', error);
        return text; // Return original text if translation fails
    }
}


// Download CSV
function downloadExcel() {
    try {
        const table = document.getElementById('tasksTable');
        if (!table) {
            displayError('No tasks table found');
            return;
        }

        // Get selected rows or all rows
        const selectedRows = getSelectedRows();
        const rowsToDownload = selectedRows.length > 0 ? selectedRows : window.originalTasks;

        if (rowsToDownload.length === 0) {
            displayError('No tasks to download');
            return;
        }

        // Create CSV content with header (excluding checkbox column)
        const headerRow = table.querySelector('thead tr');
        const headerCells = Array.from(headerRow.querySelectorAll('th')).slice(1); // Skip checkbox column
        const headerContent = headerCells.map(cell => {
            const text = cell.textContent.replace(/"/g, '""');
            return `"${text}"`;
        }).join(',');
        
        // Add data rows
        const dataContent = rowsToDownload.map(task => {
            return [
                task.skillLevel || 'N/A',
                task.bloomLevel || 'N/A',
                task.mainSkill || 'N/A',
                task.subskill || 'N/A',
                task.heading || 'N/A',
                task.content || 'N/A',
                task.task || 'N/A',
                task.application || 'N/A'
            ].map(text => {
                const escapedText = (text || 'N/A').replace(/"/g, '""');
                return `"${escapedText}"`;
            }).join(',');
        }).join('\n');
        
        const csvContent = headerContent + '\n' + dataContent;
        
        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `PLAT_SKILL_Tasks_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const message = selectedRows.length > 0 
            ? `Successfully downloaded ${selectedRows.length} selected tasks!`
            : `Successfully downloaded ${rowsToDownload.length} tasks!`;
        showSuccess(message);
        
    } catch (error) {
        console.error('CSV download error:', error);
        displayError(`Failed to download CSV file: ${error.message}`);
    }
}

// Column Selection Functions
function openColumnModal() {
    if (DOM.columnSelectionModal) {
        DOM.columnSelectionModal.classList.remove('hidden');
    }
}

function closeColumnModal() {
    if (DOM.columnSelectionModal) {
        DOM.columnSelectionModal.classList.add('hidden');
    }
}

function selectAllColumns() {
    const checkboxes = document.querySelectorAll('#columnSelectionModal input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function deselectAllColumns() {
    const checkboxes = document.querySelectorAll('#columnSelectionModal input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function getSelectedColumns() {
    const columnMapping = {
        'col-skill-level': { key: 'skillLevel', header: 'Skill Level' },
        'col-bloom-level': { key: 'bloomLevel', header: 'Bloom Level' },
        'col-main-skill': { key: 'mainSkill', header: 'Main Skill' },
        'col-subskill': { key: 'subskill', header: 'Subskill' },
        'col-heading': { key: 'heading', header: 'Heading' },
        'col-content': { key: 'content', header: 'Content' },
        'col-task': { key: 'task', header: 'Task' },
        'col-application': { key: 'application', header: 'Application' }
    };
    
    const selectedColumns = [];
    Object.keys(columnMapping).forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox && checkbox.checked) {
            selectedColumns.push(columnMapping[checkboxId]);
        }
    });
    
    return selectedColumns;
}

function downloadSelectedColumns() {
    try {
        if (!window.originalTasks) {
            displayError('No tasks available to download');
            return;
        }

        const selectedColumns = getSelectedColumns();
        const selectedRows = getSelectedRows();
        
        if (selectedColumns.length === 0) {
            displayError('Please select at least one column to download');
            return;
        }
        
        if (selectedRows.length === 0) {
            displayError('Please select at least one row to download');
            return;
        }

        // Create CSV content with selected columns and rows
        const headerContent = selectedColumns.map(col => {
            const text = col.header.replace(/"/g, '""');
            return `"${text}"`;
        }).join(',');
        
        // Add data rows for selected rows only
        const dataContent = selectedRows.map(task => {
            return selectedColumns.map(col => {
                const text = (task[col.key] || 'N/A').replace(/"/g, '""');
                return `"${text}"`;
            }).join(',');
        }).join('\n');
        
        const csvContent = headerContent + '\n' + dataContent;
        
        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `PLAT_SKILL_Tasks_Selected_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showSuccess(`Successfully downloaded ${selectedRows.length} tasks with ${selectedColumns.length} selected columns!`);
        closeColumnModal();
        
    } catch (error) {
        console.error('CSV download error:', error);
        displayError(`Failed to download CSV file: ${error.message}`);
    }
}

// Row Selection Functions
function addRowSelectionListeners() {
    // Add event listener for "Select All" checkbox
    if (DOM.selectAllRowsCheckbox) {
        DOM.selectAllRowsCheckbox.addEventListener('change', handleSelectAllRows);
    }
    
    // Add event listeners for individual row checkboxes
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleRowSelection);
    });
}

function handleSelectAllRows() {
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const isChecked = DOM.selectAllRowsCheckbox.checked;
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        const row = checkbox.closest('tr');
        if (isChecked) {
            row.classList.add('selected-row');
        } else {
            row.classList.remove('selected-row');
        }
    });
    
    updateSelectedRowsCount();
}

function handleRowSelection(event) {
    const checkbox = event.target;
    const row = checkbox.closest('tr');
    
    if (checkbox.checked) {
        row.classList.add('selected-row');
    } else {
        row.classList.remove('selected-row');
    }
    
    // Update "Select All" checkbox state
    updateSelectAllCheckbox();
    updateSelectedRowsCount();
}

function updateSelectAllCheckbox() {
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    
    if (checkedCheckboxes.length === 0) {
        DOM.selectAllRowsCheckbox.indeterminate = false;
        DOM.selectAllRowsCheckbox.checked = false;
    } else if (checkedCheckboxes.length === rowCheckboxes.length) {
        DOM.selectAllRowsCheckbox.indeterminate = false;
        DOM.selectAllRowsCheckbox.checked = true;
    } else {
        DOM.selectAllRowsCheckbox.indeterminate = true;
        DOM.selectAllRowsCheckbox.checked = false;
    }
}

function updateSelectedRowsCount() {
    const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const count = checkedCheckboxes.length;
    
    if (DOM.selectedRowsCount) {
        DOM.selectedRowsCount.textContent = `${count} row${count !== 1 ? 's' : ''} selected`;
    }
}

function getSelectedRows() {
    const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const selectedIndices = Array.from(checkedCheckboxes).map(checkbox => 
        parseInt(checkbox.getAttribute('data-index'))
    );
    
    return selectedIndices.map(index => window.originalTasks[index]).filter(task => task);
}

// Prompt Management Functions
function initializePromptManagement() {
    // Load saved prompt
    loadSavedPrompt();
    
    // Add event listeners
    addPromptEventListeners();
}

function loadSavedPrompt() {
    const promptTextarea = document.getElementById('custom-prompt');
    
    if (promptTextarea) {
        // Load existing custom prompt if available
        const savedPrompt = localStorage.getItem('customPrompt');
        
        if (savedPrompt) {
            promptTextarea.value = savedPrompt;
            promptTextarea.placeholder = 'Custom prompt loaded. Modify as needed.';
        } else {
            // Provide clean, simple placeholder
            promptTextarea.placeholder = 'Create your custom prompt here. Use placeholders like {{education-level}}, {{main-skill}}, {{skill-level}}, {{task-count}} for dynamic content.';
        }
    }
}

function resetToDefaultPrompt() {
    const promptTextarea = document.getElementById('custom-prompt');
    if (promptTextarea) {
        promptTextarea.value = '';
        promptTextarea.placeholder = 'Create your custom prompt here. Use placeholders like {{education-level}}, {{main-skill}}, {{skill-level}}, {{task-count}}';
        localStorage.removeItem('customPrompt');
        showSuccess('Custom prompt cleared! Please create your own custom prompt.');
    }
}

function saveCustomPrompt() {
    const promptTextarea = document.getElementById('custom-prompt');
    if (promptTextarea) {
        const prompt = promptTextarea.value.trim();
        
        if (!prompt) {
            displayError('Please enter a custom prompt');
        return;
    }
    
        // Validate prompt
        const validation = validateCustomPrompt(prompt);
        if (!validation.isValid) {
            displayError(`Invalid prompt: ${validation.error}`);
        return;
    }
    
        // Save prompt
        localStorage.setItem('customPrompt', prompt);
        showSuccess('Custom prompt saved successfully!');
    }
}

function validateCustomPrompt(prompt) {
    const requiredPlaceholders = ['{{education-level}}', '{{education-year}}', '{{semester}}', '{{main-skill}}', '{{skill-level}}', '{{task-count}}'];
    const missingPlaceholders = requiredPlaceholders.filter(placeholder => !prompt.includes(placeholder));
    
    if (missingPlaceholders.length > 0) {
        return {
            isValid: false,
            error: `Missing required placeholders: ${missingPlaceholders.join(', ')}`
        };
    }
    
    return { isValid: true };
}

async function testCustomPrompt() {
    const promptTextarea = document.getElementById('custom-prompt');
    if (!promptTextarea) return;
    
    const prompt = promptTextarea.value.trim();
    if (!prompt) {
        displayError('Please enter a custom prompt first');
        return;
    }
    
    // Validate prompt
    const validation = validateCustomPrompt(prompt);
    if (!validation.isValid) {
        displayError(`Invalid prompt: ${validation.error}`);
        return;
    }
    
    const testBtn = document.getElementById('test-prompt');
    if (testBtn) {
        testBtn.disabled = true;
        testBtn.textContent = 'Testing...';
    }
    
    try {
        // Test with sample data
        const testData = {
            'education-level': 'bachelor',
            'education-year': '2nd-year',
            'semester': '3rd-semester',
            'main-skill': 'communication',
            'skill-level': 'medium',
            'task-count': '3'
        };
        
        const processedPrompt = processPromptWithData(prompt, testData);
        const result = await callGeminiAPI(processedPrompt);
        
        showTestResults(result);
        
    } catch (error) {
        console.error('Prompt test failed:', error);
        displayError(`Prompt test failed: ${error.message}`);
    } finally {
        if (testBtn) {
            testBtn.disabled = false;
            testBtn.textContent = 'Test Prompt';
        }
    }
}

function processPromptWithData(prompt, data) {
    return prompt
        .replace(/\{\{education-level\}\}/g, data['education-level'])
        .replace(/\{\{education-year\}\}/g, data['education-year'])
        .replace(/\{\{semester\}\}/g, data.semester)
        .replace(/\{\{main-skill\}\}/g, data['main-skill'])
        .replace(/\{\{skill-level\}\}/g, data['skill-level'])
        .replace(/\{\{task-count\}\}/g, data['task-count']);
}

function showTestResults(testResult) {
    // Create modal for test results
    const modal = document.createElement('div');
    modal.className = 'test-results-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Prompt Test Results</h3>
                <button class="close-btn" onclick="closeTestModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="test-status success">
                    ✅ Test Successful
                </div>
                <div class="test-response">
                    <h4>Gemini Response:</h4>
                    <pre>${testResult}</pre>
                </div>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'block';
}

function closeTestModal() {
    const modal = document.querySelector('.test-results-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// UI Functions
function showLoading() {
    DOM.loadingDiv.classList.remove('hidden');
    DOM.loadingDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function displayError(message) {
    console.error('Error:', message);
    
    // Hide loading
    DOM.loadingDiv.classList.add('hidden');
    
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 5000);
}

function showSuccess(message) {
    console.log('Success:', message);
    
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
        setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
        }, 3000);
}

function getErrorMessage(error) {
    // Enhanced error messages for better user guidance
    if (error.message.includes('API')) {
        return 'AI service temporarily unavailable. Please check your API key and try again.';
    }
    if (error.message.includes('prompt')) {
        return 'Custom prompt issue detected. Please check your prompt format and required placeholders.';
    }
    if (error.message.includes('validation')) {
        return 'Input validation failed. Please check all required fields and try again.';
    }
    if (error.message.includes('parsing')) {
        return 'Task parsing failed. Please check your custom prompt format and try again.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Network error. Please check your internet connection and try again.';
    }
    return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
}

// API Configuration Functions
function loadApiConfiguration() {
    const savedApiKey = localStorage.getItem('geminiApiKey1');
    const savedModel = localStorage.getItem('selectedModel');

    if (savedApiKey && DOM.geminiApiKeyInput) {
        DOM.geminiApiKeyInput.value = savedApiKey;
        CONFIG.GEMINI_API_KEYS[0] = savedApiKey;
    }
    
    if (savedModel && DOM.geminiModelSelect) {
        DOM.geminiModelSelect.value = savedModel;
        CONFIG.DEFAULT_MODEL = savedModel;
    }
}

function saveApiConfiguration() {
    const apiKey = DOM.geminiApiKeyInput?.value.trim();
    const selectedModel = DOM.geminiModelSelect?.value;
    
    if (!apiKey) {
        showApiStatus('Please enter a Gemini API key', 'error');
        return;
    }
    
    if (!selectedModel) {
        showApiStatus('Please select a model', 'error');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('geminiApiKey1', apiKey);
    localStorage.setItem('selectedModel', selectedModel);
    
    // Update config
    CONFIG.GEMINI_API_KEYS[0] = apiKey;
    CONFIG.DEFAULT_MODEL = selectedModel;
    
    showApiStatus('API configuration saved successfully!', 'success');
}

async function testApiKey() {
    const apiKey = DOM.geminiApiKeyInput?.value.trim();
    const selectedModel = DOM.geminiModelSelect?.value;
        
                if (!apiKey) {
        showApiStatus('Please enter a Gemini API key first', 'error');
        return;
    }

    if (!selectedModel) {
        showApiStatus('Please select a model first', 'error');
        return;
    }
    
    const button = DOM.testGeminiApiBtn;
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    }
    
    try {
        // Test with a simple prompt
        const testPrompt = 'Hello, this is a test. Please respond with "API test successful".';
        const response = await callGeminiAPI(testPrompt, selectedModel);
        
        if (response && response.toLowerCase().includes('successful')) {
            showApiStatus('API key is valid and working!', 'success');
        } else {
            showApiStatus('API key test completed, but response was unexpected', 'warning');
        }
        
    } catch (error) {
        console.error('API test failed:', error);
        showApiStatus(`API test failed: ${error.message}`, 'error');
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-vial"></i> Test API Key';
        }
    }
}

function togglePasswordVisibility() {
    const input = DOM.geminiApiKeyInput;
    const button = DOM.toggleApiKeyBtn;
    
    if (input && button) {
        if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            button.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }
}

function showApiStatus(message, type = 'success') {
    if (DOM.apiStatus) {
        DOM.apiStatus.textContent = message;
        DOM.apiStatus.className = `api-status ${type}`;
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            if (DOM.apiStatus) {
                DOM.apiStatus.textContent = '';
                DOM.apiStatus.className = 'api-status';
            }
        }, 3000);
    }
}

// Event Listeners
function addEventListeners() {
    // Form submission
    if (DOM.form) {
        DOM.form.addEventListener('submit', handleFormSubmit);
    }
    
    // Generate Tasks Button
    if (DOM.generateTasksBtn) {
        DOM.generateTasksBtn.addEventListener('click', async () => {
            try {
                // Validate form
                const formData = new FormData(DOM.form);
                const data = Object.fromEntries(formData.entries());
                
                if (!validateForm(data)) {
                    return;
                }
                
                // Show loading
                showLoading();
                
                // Generate tasks
                const result = await generateEmployabilityTasks(data);
                
                // Display results
                await displayResults(result);
                
            } catch (error) {
                console.error('Error generating tasks:', error);
                displayError(getErrorMessage(error));
            }
        });
    }
    
    // API Configuration
    if (DOM.saveGeminiConfigBtn) {
        DOM.saveGeminiConfigBtn.addEventListener('click', saveApiConfiguration);
    }
    
    if (DOM.testGeminiApiBtn) {
        DOM.testGeminiApiBtn.addEventListener('click', testApiKey);
    }
    
    if (DOM.toggleApiKeyBtn) {
        DOM.toggleApiKeyBtn.addEventListener('click', togglePasswordVisibility);
    }
    
    // Results buttons
    if (DOM.newTasksBtn) {
        DOM.newTasksBtn.addEventListener('click', () => {
            DOM.resultsDiv.classList.add('hidden');
            DOM.form.style.display = 'block';
        });
    }
    
    if (DOM.downloadExcelBtn) {
        DOM.downloadExcelBtn.addEventListener('click', downloadExcel);
    }
    
    if (DOM.selectColumnsBtn) {
        DOM.selectColumnsBtn.addEventListener('click', openColumnModal);
    }
    
    if (DOM.downloadSelectedColumnsBtn) {
        DOM.downloadSelectedColumnsBtn.addEventListener('click', downloadSelectedColumns);
    }
    
    if (DOM.selectAllColumnsBtn) {
        DOM.selectAllColumnsBtn.addEventListener('click', selectAllColumns);
    }
    
    if (DOM.deselectAllColumnsBtn) {
        DOM.deselectAllColumnsBtn.addEventListener('click', deselectAllColumns);
    }
    
    if (DOM.translateTasksBtn) {
        DOM.translateTasksBtn.addEventListener('click', async () => {
            if (!window.originalTasks) {
                displayError('No tasks available to translate');
        return;
    }

            const selectedLanguage = DOM.preferredLanguageSelect?.value || 'en';
            
            if (selectedLanguage === 'en') {
                populateTasksTable(window.originalTasks);
        return;
    }
            
            try {
                DOM.translateTasksBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
                DOM.translateTasksBtn.disabled = true;
                
                const translatedTasks = await translateTasks(window.originalTasks, selectedLanguage);
                populateTasksTable(translatedTasks);
                
                showSuccess(`Successfully translated ${translatedTasks.length} tasks to ${CONFIG.SUPPORTED_LANGUAGES[selectedLanguage]}!`);
        
    } catch (error) {
                console.error('Translation failed:', error);
                displayError('Translation failed. Please try again.');
    } finally {
                DOM.translateTasksBtn.innerHTML = '<i class="fas fa-language"></i> Translate';
                DOM.translateTasksBtn.disabled = false;
            }
        });
    }
    
}

function addPromptEventListeners() {
    // Add event listeners for prompt management
    document.getElementById('reset-prompt')?.addEventListener('click', resetToDefaultPrompt);
    document.getElementById('test-prompt')?.addEventListener('click', testCustomPrompt);
    document.getElementById('save-prompt')?.addEventListener('click', saveCustomPrompt);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
