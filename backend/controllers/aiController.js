import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utills/geminiService.js';
import { findRelevantChunks } from '../utills/textChunker.js';

// @desc    Generate flashcards from document
// @route   POST /api/ai/generate-flashcards
// @access  Private
export const generateFlashcards = async (req, res, next) => {
    try {
  
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Generate quiz from document
  // @route   POST /api/ai/generate-quiz
  // @access  Private
  export const generateQuiz = async (req, res, next) => {
  
  };
  
  // @desc    Generate document summary
  // @route   POST /api/ai/generate-summary
  // @access  Private
  export const generateSummary = async (req, res, next) => {
      
  }

  // @desc    Generate document summary
  // @route   POST /api/ai/generate-summary
  // @access  Private
  export const chat = async (req, res, next) => {
      
  }

  // @desc    Generate document summary
  // @route   POST /api/ai/generate-summary
  // @access  Private
  export const explainConcept = async (req, res, next) => {
      
  }

  // @desc    Generate document summary
  // @route   POST /api/ai/generate-summary
  // @access  Private
  export const getChatHistory = async (req, res, next) => {
      
  }

