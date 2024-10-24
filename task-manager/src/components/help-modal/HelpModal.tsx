'use client';
import React from 'react';
import './HelpModal.scss';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="Help-modal" role="dialog" onClick={handleBackdropClick}>
            <div className="Help-content">
                <h2 id="help-title">Keyboard Shortcuts</h2>
                <ul>
                    <li><strong>Tab</strong>: Navigate through interactive elements</li>
                    <li><strong>Arrow Keys</strong> (Left/Right): Switch between tabs</li>
                    <li><strong>Enter</strong>: Toggle task completion</li>
                    <li><strong>E</strong>: Edit focused task</li>
                    <li><strong>Delete</strong>: Delete focused task</li>
                    <li><strong>?</strong>: Open this help dialog</li>
                    <li><strong>Escape</strong>: Cancel editing</li>
                </ul>
                <button onClick={onClose} className="Help-closeBtn" aria-label="Close Help">
                    Close
                </button>
            </div>
        </div>
    );
};

export default HelpModal;
