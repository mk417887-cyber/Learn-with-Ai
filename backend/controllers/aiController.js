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
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'processed'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready for processing',
        statusCode: 404
      });
    }

    // 1. Generate flashcards using gemini API
    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count, 10) // Specified radix 10 for safety
    );

    // 2. Save the full set to the database first
    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map(card => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
        lastReviewed: null
      }))
    });

    // 3. Send a SINGLE success response containing the created database record
    return res.status(201).json({
      success: true,
      data: flashcardSet,
      statusCode: 201, // Updated to match the HTTP status 201
      message: 'Flashcards generated and saved successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Generate quiz from document
// @route   POST /api/ai/generate-quiz
// @access  Private
export const generateQuiz = async (req, res, next) => {
  const { documentId, numQuestions = 5, title } = req.body;

  // 1. Initial request validation (Keep outside try/catch to catch bad inputs immediately)
  if (!documentId) {
    return res.status(400).json({
      success: false,
      error: 'Please provide documentId',
      statusCode: 400
    });
  }

  try {
    // 2. Fetch the document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'processed'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }

    // 3. Generate Quiz using Gemini API
    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions, 10) // Specified radix 10 for safety
    );

    // 4. Save to database
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `Quiz on ${document.title}`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0
    });

    // 5. Send successful response
    return res.status(201).json({
      success: true,
      data: quiz,
      statusCode: 201,
      message: 'Quiz created successfully'
    });

  } catch (error) {
    // 6. Forward any async database or API errors to Express error handler
    next(error);
  }
};
// @desc    Generate document summary
// @route   POST /api/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }

    // Generate summary using Gemini
    const summary = await geminiService.generateSummary(document.extractedText);

    res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary
      },
      message: 'Summary generated successfully'
    });
  } catch (error) {
    next(error)
  }
};
// @desc    Generate document summary
// @route   POST /api/ai/generate-summary
// @access  Private
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and question',
        statusCode: 400
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }
    // Find relevant chunks
    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map(c => c.chunkIndex);

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: []
      });
    }

    // Generate response using Gemini
    const response = await geminiService.chat(question, document.extractedText, chunkIndices);

    // Save response to chat history
    chatHistory.messages.push({
      role: 'user',
      content: question,
      timestamp: new Date(),
      relevantChunks: []
    },
      {
        role: 'assistant',
        content: question,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      });
    chatHistory.messages.push({
      role: 'assistant',
      content: response
    });
    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id,
      },
      message: 'Chat response generated successfully'
    });
  }
  catch (error) {
    next(error)
  }
}

// @desc    Generate document summary
// @route   POST /api/ai/generate-summary
// @access  Private
export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and concept',
        statusCode: 400
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }
    // Find relevant chunks for the concept
    const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
    const context = relevantChunks.map(c => c.content).join('\n\n');

    // Generate explanation using Gemini
    const explanation = await geminiService.explainConcept(concept, context);

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex),
      },
      message: 'Concept explanation generated successfully'
    });

  } catch (error) {
    next(error)
  }
};

// @desc    Generate document summary
// @route   POST /api/ai/generate-summary
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

if (!documentId) {
    return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400
    });
}

const chatHistory = await ChatHistory.findOne({
    userId: req.user._id,
    documentId: documentId
}).select('messages'); // Only retrieve the messages array

if (!chatHistory) {
    return res.status(200).json({
        success: true,
        data: [], // Return an empty array if no chat history found
        message: 'No chat history found'
    });
}

res.status(200).json({
    success: true,
    data: chatHistory.messages,
    message: 'Chat history retrieved successfully'
});
  } catch (error) {
    next(error)
  }
};

