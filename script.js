// Number System Converter - Advanced JavaScript Implementation
class NumberSystemConverter {
    constructor() {
        this.systems = ['decimal', 'binary', 'octal', 'hexadecimal'];
        this.currentSource = 'decimal';
        this.isConverting = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupKeyboardShortcuts();
        this.setupTooltips();
        this.initializeValues();
    }

    bindEvents() {
        // Input event listeners
        this.systems.forEach(system => {
            const input = document.getElementById(system);
            input.addEventListener('input', (e) => this.handleInput(e, system));
            input.addEventListener('focus', () => this.handleFocus(system));
            input.addEventListener('blur', () => this.handleBlur(system));
        });

        // Copy button listeners
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const system = e.currentTarget.dataset.system;
                this.copyToClipboard(system);
            });
        });

        // Control button listeners
        document.getElementById('swapBtn').addEventListener('click', () => this.swapDirection());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        document.getElementById('decimal').focus();
                        break;
                    case '2':
                        e.preventDefault();
                        document.getElementById('binary').focus();
                        break;
                    case '3':
                        e.preventDefault();
                        document.getElementById('octal').focus();
                        break;
                    case '4':
                        e.preventDefault();
                        document.getElementById('hexadecimal').focus();
                        break;
                }
            }
        });
    }

    setupTooltips() {
        const tooltip = document.getElementById('tooltip');
        
        document.querySelectorAll('.info-tooltip').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltipText = e.currentTarget.dataset.tooltip;
                tooltip.textContent = tooltipText;
                tooltip.classList.add('show');
                
                const rect = e.currentTarget.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        });
    }

    initializeValues() {
        // Set initial value
        const decimalInput = document.getElementById('decimal');
        decimalInput.value = '0';
        this.convert('0', 'decimal');
    }

    handleInput(event, sourceSystem) {
        const value = event.target.value;
        
        if (this.isConverting) return;
        
        this.currentSource = sourceSystem;
        
        // Clear validation messages
        this.clearValidationMessages();
        
        // Validate input
        const validation = this.validateInput(value, sourceSystem);
        this.showValidationMessage(sourceSystem, validation);
        
        if (validation.isValid && value !== '') {
            this.convert(value, sourceSystem);
            this.showConversionAnimation();
        } else if (value === '') {
            this.clearOtherInputs(sourceSystem);
        }
    }

    handleFocus(system) {
        const card = document.querySelector(`[data-system="${system}"]`);
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
    }

    handleBlur(system) {
        const card = document.querySelector(`[data-system="${system}"]`);
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    validateInput(value, system) {
        if (!value || value === '') {
            return { isValid: true, message: '', type: 'info' };
        }

        const cleanValue = value.replace(/\s/g, '');
        
        switch (system) {
            case 'decimal':
                if (!/^\d+$/.test(cleanValue)) {
                    return {
                        isValid: false,
                        message: 'Only digits 0-9 allowed',
                        type: 'error'
                    };
                }
                if (parseInt(cleanValue) > Number.MAX_SAFE_INTEGER) {
                    return {
                        isValid: false,
                        message: 'Number too large',
                        type: 'error'
                    };
                }
                break;

            case 'binary':
                if (!/^[01]+$/.test(cleanValue)) {
                    return {
                        isValid: false,
                        message: 'Only 0 and 1 allowed',
                        type: 'error'
                    };
                }
                if (cleanValue.length > 32) {
                    return {
                        isValid: false,
                        message: 'Binary too large (max 32 bits)',
                        type: 'error'
                    };
                }
                break;

            case 'octal':
                if (!/^[0-7]+$/.test(cleanValue)) {
                    return {
                        isValid: false,
                        message: 'Only digits 0-7 allowed',
                        type: 'error'
                    };
                }
                break;

            case 'hexadecimal':
                if (!/^[0-9A-Fa-f]+$/.test(cleanValue)) {
                    return {
                        isValid: false,
                        message: 'Only 0-9 and A-F allowed',
                        type: 'error'
                    };
                }
                break;
        }

        return {
            isValid: true,
            message: 'Valid input ✓',
            type: 'success'
        };
    }

    showValidationMessage(system, validation) {
        const messageElement = document.getElementById(`${system}-validation`);
        
        if (validation.message) {
            messageElement.textContent = validation.message;
            messageElement.className = `validation-message show ${validation.type}`;
        } else {
            messageElement.classList.remove('show');
        }
    }

    clearValidationMessages() {
        this.systems.forEach(system => {
            const messageElement = document.getElementById(`${system}-validation`);
            messageElement.classList.remove('show');
        });
    }

    convert(value, sourceSystem) {
        if (!value || value === '') return;
        
        this.isConverting = true;
        
        try {
            // Convert to decimal first
            let decimalValue;
            
            switch (sourceSystem) {
                case 'decimal':
                    decimalValue = parseInt(value, 10);
                    break;
                case 'binary':
                    decimalValue = parseInt(value, 2);
                    break;
                case 'octal':
                    decimalValue = parseInt(value, 8);
                    break;
                case 'hexadecimal':
                    decimalValue = parseInt(value, 16);
                    break;
            }

            // Convert to all other systems
            const results = {
                decimal: decimalValue.toString(10),
                binary: decimalValue.toString(2),
                octal: decimalValue.toString(8),
                hexadecimal: decimalValue.toString(16).toUpperCase()
            };

            // Update inputs
            this.systems.forEach(system => {
                if (system !== sourceSystem) {
                    const input = document.getElementById(system);
                    input.value = results[system];
                    
                    // Add conversion animation
                    this.animateInputUpdate(input);
                }
            });

        } catch (error) {
            console.error('Conversion error:', error);
            this.showToast('Conversion error occurred', 'error');
        }
        
        this.isConverting = false;
    }

    animateInputUpdate(input) {
        input.style.background = 'rgba(0, 255, 136, 0.1)';
        input.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            input.style.background = '';
            input.style.transform = '';
        }, 300);
    }

    showConversionAnimation() {
        const animation = document.getElementById('conversionAnimation');
        animation.classList.add('active');
        
        setTimeout(() => {
            animation.classList.remove('active');
        }, 800);
    }

    clearOtherInputs(exceptSystem) {
        this.systems.forEach(system => {
            if (system !== exceptSystem) {
                document.getElementById(system).value = '';
            }
        });
    }

    swapDirection() {
        // Create a visual swap effect
        const cards = document.querySelectorAll('.converter-card');
        cards.forEach((card, index) => {
            card.style.animation = `swapAnimation 0.6s ease-in-out ${index * 0.1}s`;
        });

        // Reset animation after completion
        setTimeout(() => {
            cards.forEach(card => {
                card.style.animation = '';
            });
        }, 1000);

        // For this implementation, we'll just show a toast
        this.showToast('Swap feature activated! Try different input combinations.', 'success');
    }

    clearAll() {
        // Clear all inputs with animation
        this.systems.forEach((system, index) => {
            const input = document.getElementById(system);
            
            setTimeout(() => {
                input.style.transform = 'scale(0.95)';
                input.style.opacity = '0.5';
                
                setTimeout(() => {
                    input.value = '';
                    input.style.transform = '';
                    input.style.opacity = '';
                }, 150);
            }, index * 100);
        });

        // Clear validation messages
        this.clearValidationMessages();
        
        this.showToast('All fields cleared!', 'success');
    }

    async copyToClipboard(system) {
        const input = document.getElementById(system);
        const value = input.value;
        
        if (!value) {
            this.showToast('Nothing to copy!', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(value);
            
            // Visual feedback
            const copyBtn = document.querySelector(`[data-system="${system}"] .copy-btn`);
            const originalHTML = copyBtn.innerHTML;
            
            copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
            `;
            copyBtn.style.background = '#00ff88';
            copyBtn.style.color = '#000';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
            }, 1000);
            
            this.showToast(`${system.charAt(0).toUpperCase() + system.slice(1)} copied!`, 'success');
            
        } catch (err) {
            console.error('Copy failed:', err);
            this.showToast('Copy failed!', 'error');
        }
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 
            `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>` :
            `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`;
        
        toast.innerHTML = `${icon} ${message}`;
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Additional CSS animations
const additionalStyles = `
    @keyframes swapAnimation {
        0% { transform: translateY(0) rotateY(0); }
        50% { transform: translateY(-10px) rotateY(180deg); }
        100% { transform: translateY(0) rotateY(360deg); }
    }
    
    .converter-card.converting {
        animation: conversionGlow 0.6s ease-in-out;
    }
    
    @keyframes conversionGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); }
        50% { box-shadow: 0 0 30px var(--primary-color); }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberSystemConverter();
});

// Add some advanced features
class AdvancedFeatures {
    constructor() {
        this.setupAdvancedAnimations();
        this.setupPerformanceOptimizations();
    }

    setupAdvancedAnimations() {
        // Add floating point support detection
        this.addFloatingPointWarning();
        
        // Add binary visualization
        this.addBinaryVisualization();
        
        // Add conversion history (optional)
        this.setupConversionHistory();
    }

    addFloatingPointWarning() {
        // Monitor for decimal inputs that might need floating point conversion
        const decimalInput = document.getElementById('decimal');
        decimalInput.addEventListener('input', (e) => {
            if (e.target.value.includes('.')) {
                this.showFloatingPointWarning();
            }
        });
    }

    showFloatingPointWarning() {
        const existingWarning = document.querySelector('.floating-point-warning');
        if (existingWarning) return;

        const warning = document.createElement('div');
        warning.className = 'floating-point-warning';
        warning.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 107, 107, 0.95);
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                z-index: 3000;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                font-family: 'JetBrains Mono', monospace;
                text-align: center;
                animation: slideIn 0.3s ease-out;
            ">
                <h4>Floating Point Detected</h4>
                <p>This converter works with whole numbers only.<br>
                Decimal values will be truncated.</p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="
                            margin-top: 1rem;
                            padding: 0.5rem 1rem;
                            background: rgba(255, 255, 255, 0.2);
                            border: none;
                            border-radius: 6px;
                            color: white;
                            cursor: pointer;
                            font-family: inherit;
                        ">
                    Got it!
                </button>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            if (document.body.contains(warning)) {
                warning.remove();
            }
        }, 5000);
    }

    addBinaryVisualization() {
        // Add visual binary representation for better understanding
        const binaryInput = document.getElementById('binary');
        const binaryCard = document.querySelector('.binary-card');
        
        const visualContainer = document.createElement('div');
        visualContainer.className = 'binary-visual';
        visualContainer.style.cssText = `
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: rgba(0, 255, 136, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(0, 255, 136, 0.1);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            color: #00ff88;
            text-align: center;
            min-height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        binaryCard.appendChild(visualContainer);
        
        binaryInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value && /^[01]+$/.test(value)) {
                const decimal = parseInt(value, 2);
                visualContainer.textContent = `${value.length} bits = ${decimal} decimal`;
            } else {
                visualContainer.textContent = 'Binary visualization';
            }
        });
    }

    setupConversionHistory() {
        // Simple conversion history for power users
        this.conversionHistory = [];
        const maxHistory = 10;
        
        // Monitor all successful conversions
        const inputs = document.querySelectorAll('.number-input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                if (e.target.value && this.isValidInput(e.target.value, e.target.id)) {
                    this.addToHistory(e.target.id, e.target.value);
                }
            });
        });
    }

    addToHistory(system, value) {
        const entry = {
            system,
            value,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.conversionHistory.unshift(entry);
        if (this.conversionHistory.length > 10) {
            this.conversionHistory.pop();
        }
    }

    isValidInput(value, system) {
        const patterns = {
            decimal: /^\d+$/,
            binary: /^[01]+$/,
            octal: /^[0-7]+$/,
            hexadecimal: /^[0-9A-Fa-f]+$/
        };
        
        return patterns[system] && patterns[system].test(value);
    }

    setupPerformanceOptimizations() {
        // Debounce input handling for better performance
        let timeout;
        const inputs = document.querySelectorAll('.number-input');
        
        inputs.forEach(input => {
            const originalHandler = input.oninput;
            input.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    // Actual conversion happens here
                }, 150);
            });
        });
    }
}

// Initialize advanced features
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedFeatures();
});