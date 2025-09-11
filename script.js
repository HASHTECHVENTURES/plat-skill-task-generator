// PLAT SKILL Employability Task Generator
// Configuration
const CONFIG = {
    // Gemini API Configuration
    GEMINI_API_KEYS: [
        '',  // Primary key - will be loaded from localStorage
        ''   // Secondary key - will be loaded from localStorage
    ],
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    
    // Available Gemini Models
    AVAILABLE_MODELS: {
        'gemini-2.0-flash': 'Gemini 2.0 Flash (Latest & Fastest)',
        'gemini-1.5-flash': 'Gemini 1.5 Flash (Balanced)'
    },
    
    // Default model
    DEFAULT_MODEL: 'gemini-2.0-flash',
    
    REQUIRED_FIELDS: ['education-level', 'education-year', 'semester', 'main-skill', 'skill-level', 'task-count'],
    
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
        'or': 'Odia'
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
    downloadSelectedExcelBtn: null,
    selectAllCheckbox: null,
    selectionCounter: null,
    geminiApiKeyInput: null,
    geminiModelSelect: null,
    testGeminiApiBtn: null,
    saveGeminiConfigBtn: null,
    resetGeminiConfigBtn: null,
    apiStatus: null,
    generateTasksBtn: null,
    
    init() {
        this.form = document.getElementById('taskForm');
        this.loadingDiv = document.getElementById('loading');
        this.resultsDiv = document.getElementById('results');
        this.tasksTableBody = document.getElementById('tasksTableBody');
        this.newTasksBtn = document.getElementById('newTasks');
        this.downloadExcelBtn = document.getElementById('downloadExcel');
        this.downloadSelectedExcelBtn = document.getElementById('downloadSelectedExcel');
        this.selectAllCheckbox = document.getElementById('selectAllTasks');
        this.selectionCounter = document.getElementById('selectionCounter');
        
        // API Configuration elements (updated to match ChatGPT version)
        this.apiKeyInput = document.getElementById('api-key');
        this.modelSelect = document.getElementById('model-select');
        this.testApiKeyBtn = document.getElementById('test-api-key');
        this.saveApiConfigBtn = document.getElementById('save-api-config');
        this.resetApiConfigBtn = document.getElementById('reset-api-config');
        this.apiStatus = document.getElementById('api-status');
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

// Custom prompt system - no hardcoded prompts
function createEmployabilityPrompt(data) {
    // Get custom prompt - NO FALLBACK TO DEFAULT
    const customPrompt = localStorage.getItem('customPrompt');
    
    if (!customPrompt) {
        throw new Error('No custom prompt found. Please create and save a custom prompt first.');
    }
    
    // Validate that all required placeholders are present in custom prompt
    const requiredPlaceholders = ['{{education-level}}', '{{education-year}}', '{{semester}}', '{{main-skill}}', '{{skill-level}}', '{{task-count}}'];
    const missingPlaceholders = requiredPlaceholders.filter(placeholder => !customPrompt.includes(placeholder));
    
    if (missingPlaceholders.length > 0) {
        throw new Error(`Custom prompt missing required placeholders: ${missingPlaceholders.join(', ')}. Please add these placeholders to your custom prompt.`);
    }
    
    // Process ONLY the custom prompt with data replacement
    const processedPrompt = customPrompt
        .replace(/\{\{education-level\}\}/g, data['education-level'])
        .replace(/\{\{education-year\}\}/g, data['education-year'])
        .replace(/\{\{semester\}\}/g, data.semester)
        .replace(/\{\{main-skill\}\}/g, data['main-skill'])
        .replace(/\{\{skill-level\}\}/g, data['skill-level'])
        .replace(/\{\{task-count\}\}/g, data['task-count']);
    
    // Log the processed prompt for debugging (first 200 chars)
    console.log('Using CUSTOM PROMPT - Processed preview:', processedPrompt.substring(0, 200) + '...');
    
    return processedPrompt;
}

// Parse employability tasks from AI response
function parseEmployabilityTasks(text, studentData) {
    const tasks = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
        if (line.includes('|') && !line.includes('Skill Level') && !line.includes('---')) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col);
            
            if (columns.length >= 8) {
                // New 8-column format
                tasks.push({
                    skillLevel: columns[0],
                    bloomLevel: columns[1],
                    mainSkill: columns[2],
                    subSkill: columns[3],
                    heading: columns[4],
                    content: columns[5],
                    task: columns[6],
                    application: columns[7]
                });
            } else if (columns.length >= 6) {
                // Old 6-column format - map to new format
                console.warn('Detected old 6-column format, mapping to new format...');
                tasks.push({
                    skillLevel: columns[0],
                    bloomLevel: columns[1],
                    mainSkill: 'N/A', // Default value
                    subSkill: 'N/A', // Default value
                    heading: columns[2],
                    content: columns[3],
                    task: columns[4],
                    application: columns[5]
                });
            }
        }
    }
    
    return {
        studentData,
        tasks: tasks
    };
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
                <input type="checkbox" class="task-checkbox" data-task-index="${index}">
            </td>
            <td><span class="skill-level ${task.skillLevel.toLowerCase()}">${task.skillLevel}</span></td>
            <td><span class="bloom-level">${task.bloomLevel || 'N/A'}</span></td>
            <td><span class="main-skill">${task.mainSkill || 'N/A'}</span></td>
            <td><span class="sub-skill">${task.subSkill || 'N/A'}</span></td>
            <td><strong>${task.heading}</strong></td>
            <td>${task.content}</td>
            <td>${task.task}</td>
            <td>${task.application}</td>
        `;
        DOM.tasksTableBody.appendChild(row);
    });
    
    // Initialize row selection functionality
    initializeRowSelection();
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

        // Get all rows (excluding header)
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        if (rows.length === 0) {
            displayError('No tasks to download');
            return;
        }

        // Create CSV content with header
        const headerRow = table.querySelector('thead tr');
        const headerCells = Array.from(headerRow.querySelectorAll('th'));
        const headerContent = headerCells.map(cell => {
            const text = cell.textContent.replace(/"/g, '""');
            return `"${text}"`;
        }).join(',');
        
        // Add data rows
        const dataContent = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            return cells.map(cell => {
                const text = cell.textContent.replace(/"/g, '""');
                return `"${text}"`;
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

        showSuccess(`Successfully downloaded ${rows.length} tasks!`);
        
    } catch (error) {
        console.error('CSV download error:', error);
        displayError(`Failed to download CSV file: ${error.message}`);
    }
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
        // Clear any existing saved prompt and start fresh
        promptTextarea.value = '';
        localStorage.removeItem('customPrompt');
        promptTextarea.placeholder = 'Create your custom prompt here. Use placeholders like {{education-level}}, {{main-skill}}, {{skill-level}}, {{task-count}}';
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
    console.log('testCustomPrompt called');
    const promptTextarea = document.getElementById('custom-prompt');
    if (!promptTextarea) {
        console.error('Custom prompt textarea not found');
        displayError('Custom prompt textarea not found');
        return;
    }
    
    const prompt = promptTextarea.value.trim();
    if (!prompt) {
        displayError('Please enter a custom prompt first');
        return;
    }
    
    // Check if API key is available
    const apiKey = CONFIG.GEMINI_API_KEYS[0] || CONFIG.GEMINI_API_KEYS[1];
    if (!apiKey) {
        displayError('Please configure your Gemini API key first');
        return;
    }
    
    const testBtn = document.getElementById('test-prompt');
    if (testBtn) {
        testBtn.disabled = true;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
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
        console.log('Testing prompt:', processedPrompt);
        
        const result = await callGeminiAPI(processedPrompt);
        console.log('API response:', result);
        
        showTestResults({
            success: true,
            prompt: processedPrompt,
            response: result,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Prompt test failed:', error);
        showTestResults({
            success: false,
            prompt: prompt,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    } finally {
        if (testBtn) {
            testBtn.disabled = false;
            testBtn.innerHTML = '<i class="fas fa-flask"></i> Test Prompt';
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
    const modal = document.getElementById('testResultsModal');
    const resultsBody = document.getElementById('testResultsBody');
    
    if (!modal || !resultsBody) {
        console.error('Test results modal not found');
        return;
    }
    
    // Clear previous results
    resultsBody.innerHTML = '';
    
    // Create result content
    const resultHTML = `
        <div class="test-result-item ${testResult.success ? 'test-result-success' : 'test-result-error'}">
            <h4>
                <i class="fas fa-${testResult.success ? 'check-circle' : 'exclamation-circle'}"></i>
                ${testResult.success ? 'Test Successful' : 'Test Failed'}
            </h4>
            <p><strong>Timestamp:</strong> ${new Date(testResult.timestamp).toLocaleString()}</p>
            <p><strong>Status:</strong> ${testResult.success ? 'API call completed successfully' : 'API call failed'}</p>
            
            ${testResult.success ? `
                <p><strong>Response Preview:</strong></p>
                <pre>${testResult.response.substring(0, 500)}${testResult.response.length > 500 ? '...' : ''}</pre>
            ` : `
                <p><strong>Error:</strong> ${testResult.error}</p>
            `}
            
            <p><strong>Processed Prompt:</strong></p>
            <pre>${testResult.prompt.substring(0, 300)}${testResult.prompt.length > 300 ? '...' : ''}</pre>
        </div>
    `;
    
    resultsBody.innerHTML = resultHTML;
    
    // Show modal
    modal.style.display = 'block';
    
    // Add click outside to close
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeTestModal();
        }
    };
}

function closeTestModal() {
    const modal = document.getElementById('testResultsModal');
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
    if (error.message.includes('API')) return 'AI service temporarily unavailable. Please try again.';
    if (error.message.includes('prompt')) return 'Please check your custom prompt and try again.';
    return 'Something went wrong. Please try again.';
}

// API Configuration Functions
function loadApiConfiguration() {
    const savedApiKey = localStorage.getItem('geminiApiKey1');
    const savedModel = localStorage.getItem('selectedModel');

    if (savedApiKey && DOM.apiKeyInput) {
        DOM.apiKeyInput.value = savedApiKey;
        CONFIG.GEMINI_API_KEYS[0] = savedApiKey;
    }
    
    if (savedModel && DOM.modelSelect) {
        DOM.modelSelect.value = savedModel;
        CONFIG.DEFAULT_MODEL = savedModel;
    }
}

function saveApiConfiguration() {
    const apiKey = DOM.apiKeyInput?.value.trim();
    const selectedModel = DOM.modelSelect?.value;
    
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
    const apiKey = DOM.apiKeyInput?.value.trim();
    const selectedModel = DOM.modelSelect?.value;
        
                if (!apiKey) {
        showApiStatus('Please enter a Gemini API key first', 'error');
        return;
    }

    if (!selectedModel) {
        showApiStatus('Please select a model first', 'error');
        return;
    }
    
    const button = DOM.testApiKeyBtn;
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
    const input = DOM.apiKeyInput;
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
    
    // API Configuration
    if (DOM.saveApiConfigBtn) {
        DOM.saveApiConfigBtn.addEventListener('click', saveApiConfiguration);
    }
    
    if (DOM.testApiKeyBtn) {
        DOM.testApiKeyBtn.addEventListener('click', testApiKey);
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
    
    if (DOM.downloadSelectedExcelBtn) {
        DOM.downloadSelectedExcelBtn.addEventListener('click', downloadSelectedExcel);
    }
    
}

function addPromptEventListeners() {
    // Add event listeners for prompt management
    document.getElementById('reset-prompt')?.addEventListener('click', resetToDefaultPrompt);
    document.getElementById('test-prompt')?.addEventListener('click', testCustomPrompt);
    document.getElementById('save-prompt')?.addEventListener('click', saveCustomPrompt);
}

// Test CSV download function
function testCSVDownload() {
    console.log('Testing CSV download functionality...');
    
    const table = document.getElementById('tasksTable');
    if (!table) {
        console.log('No table found - creating test data...');
        createTestDataForDownload();
        return;
    }
            
    const tbody = table.querySelector('tbody');
    if (!tbody || tbody.children.length === 0) {
        console.log('No tasks in table - creating test data...');
        createTestDataForDownload();
        return;
    }
    
    // Select all tasks for testing
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Update selection counter
    updateSelectionCounter();
    
    // Try download
    console.log('Attempting download with all tasks selected...');
    downloadSelectedExcel();
}

// Create test data for download testing
function createTestDataForDownload() {
    const testTasks = [
        {
            skillLevel: 'Low',
            bloomLevel: 'Remembering',
            mainSkill: 'Communication',
            subSkill: 'Verbal',
            heading: 'Test Task 1',
            content: 'This is a test task for download functionality',
            task: 'Complete this test task to verify CSV download',
            application: 'Apply this in real-world scenarios'
        },
        {
            skillLevel: 'Medium',
            bloomLevel: 'Understanding',
            mainSkill: 'Problem-Solving',
            subSkill: 'Analysis',
            heading: 'Test Task 2',
            content: 'Another test task for download verification',
            task: 'Complete this second test task',
            application: 'Use this in workplace situations'
        }
    ];
    
    // Create a temporary table for testing
    const table = document.createElement('table');
    table.id = 'testTasksTable';
    table.className = 'tasks-table';
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Select</th>
            <th>Skill Level</th>
            <th>Bloom Level</th>
            <th>Main Skill</th>
            <th>Sub Skill</th>
            <th>Heading</th>
            <th>Content</th>
            <th>Task</th>
            <th>Application</th>
        </tr>
    `;
    
    const tbody = document.createElement('tbody');
    testTasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="task-checkbox" checked></td>
            <td>${task.skillLevel}</td>
            <td>${task.bloomLevel}</td>
            <td>${task.mainSkill}</td>
            <td>${task.subSkill}</td>
            <td>${task.heading}</td>
            <td>${task.content}</td>
            <td>${task.task}</td>
            <td>${task.application}</td>
        `;
        tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    
    // Temporarily replace the main table
    const mainTable = document.getElementById('tasksTable');
    if (mainTable) {
        mainTable.style.display = 'none';
        mainTable.parentNode.insertBefore(table, mainTable);
        
        // Test download
        setTimeout(() => {
            downloadSelectedExcel();
            
            // Restore original table
            setTimeout(() => {
                table.remove();
                mainTable.style.display = '';
            }, 2000);
        }, 500);
    }
}

// Initialize row selection functionality
function initializeRowSelection() {
    // Add event listeners to individual checkboxes
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleTaskSelection);
    });

    // Add event listener to select all checkbox
    if (DOM.selectAllCheckbox) {
        DOM.selectAllCheckbox.addEventListener('change', handleSelectAll);
    }

    // Update selection counter
    updateSelectionCounter();
}

// Handle individual task selection
function handleTaskSelection(event) {
    const checkbox = event.target;
    const row = checkbox.closest('tr');
    
    if (checkbox.checked) {
        row.classList.add('selected');
    } else {
        row.classList.remove('selected');
    }
    
    updateSelectionCounter();
    updateSelectAllState();
}

// Handle select all checkbox
function handleSelectAll(event) {
    const isChecked = event.target.checked;
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    const rows = document.querySelectorAll('tbody tr');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    
    rows.forEach(row => {
        if (isChecked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    });
    
    updateSelectionCounter();
}

// Update selection counter
function updateSelectionCounter() {
    if (!DOM.selectionCounter) return;
    
    const selectedCount = document.querySelectorAll('.task-checkbox:checked').length;
    const totalCount = document.querySelectorAll('.task-checkbox').length;
    
    DOM.selectionCounter.textContent = `${selectedCount} selected`;
    
    // Enable/disable download selected button
    if (DOM.downloadSelectedExcelBtn) {
        DOM.downloadSelectedExcelBtn.disabled = selectedCount === 0;
    }
}

// Update select all checkbox state
function updateSelectAllState() {
    if (!DOM.selectAllCheckbox) return;
    
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    const checkedCount = document.querySelectorAll('.task-checkbox:checked').length;
    
    if (checkedCount === 0) {
        DOM.selectAllCheckbox.checked = false;
        DOM.selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === taskCheckboxes.length) {
        DOM.selectAllCheckbox.checked = true;
        DOM.selectAllCheckbox.indeterminate = false;
    } else {
        DOM.selectAllCheckbox.checked = false;
        DOM.selectAllCheckbox.indeterminate = true;
    }
}

// Download Selected CSV
function downloadSelectedExcel() {
    try {
        console.log('Starting CSV download...');
        
        const table = document.getElementById('tasksTable');
        if (!table) {
            console.error('No tasks table found');
            displayError('No tasks table found');
            return;
        }

        console.log('Table found, checking for selected rows...');

        // Get selected rows (excluding header)
        const selectedRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => {
            const checkbox = row.querySelector('.task-checkbox');
            return checkbox && checkbox.checked;
        });

        console.log(`Found ${selectedRows.length} selected rows`);

        if (selectedRows.length === 0) {
            console.log('No rows selected');
            displayError('Please select at least one task to download');
            return;
        }

        // Create CSV content with header
        const headerRow = table.querySelector('thead tr');
        if (!headerRow) {
            console.error('No header row found');
            displayError('Table structure error: No header row found');
            return;
        }

        const headerCells = Array.from(headerRow.querySelectorAll('th'));
        console.log(`Found ${headerCells.length} header cells`);
        
        const headerContent = headerCells.map(cell => {
            const text = cell.textContent.trim().replace(/"/g, '""');
            return `"${text}"`;
        }).join(',');
        
        console.log('Header content created:', headerContent);

        // Add selected data rows
        const dataContent = selectedRows.map((row, index) => {
            const cells = Array.from(row.querySelectorAll('td'));
            console.log(`Row ${index}: ${cells.length} cells`);
            return cells.map(cell => {
                const text = cell.textContent.trim().replace(/"/g, '""');
                return `"${text}"`;
            }).join(',');
        }).join('\n');
        
        const csvContent = headerContent + '\n' + dataContent;
        console.log('CSV content created, length:', csvContent.length);
        
        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        // Set download attributes
        link.href = url;
        link.download = `Employability_Tasks_Selected_${selectedRows.length}_${new Date().toISOString().split('T')[0]}.csv`;
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        console.log('Triggering download...');
        link.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('Download cleanup completed');
        }, 100);
        
        showSuccess(`Selected ${selectedRows.length} tasks downloaded successfully!`);
        console.log('CSV download completed successfully');
        
    } catch (error) {
        console.error('Error downloading selected CSV:', error);
        displayError(`Failed to download CSV file: ${error.message}`);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
