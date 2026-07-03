import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import  toast from 'react-hot-toast';
import { set } from 'mongoose';

const LoginPage = () => {

    const [email, setEmail] = useState('alex@timetoprogram.com');
    const [password, setPassword] = useState('Test@123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField , setFocusedField] = useState('');


    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async () => {
      e.preventDefault();
      setError('');
      setLoading(false);

      try {
        
      
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
  
}

export default LoginPage
