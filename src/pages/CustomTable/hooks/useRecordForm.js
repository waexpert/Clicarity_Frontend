import { useState, useCallback } from 'react';
import { tableApi } from '../services/tableApi';
import { 
  sanitizeRecordData, 
  removeNullValues, 
  generateUsId 
} from '../utils/tableHelpers';
import { DATE_FIELDS, ARRAY_FIELDS } from '../constants/tableConstants';
import { logger } from '../utils/logger';
import { toast } from 'sonner';

/**
 * Custom hook for managing record form state
 * @param {Object} apiParams - API parameters
 * @param {string} type - Table type
 * @param {Function} onSuccess - Success callback
 * @returns {Object} Form state and methods
 */
export const useRecordForm = (apiParams, type, onSuccess) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Initialize form with data
   */
  const initializeForm = useCallback((initialData = {}) => {
    setFormData(initialData);
  }, []);

  /**
   * Handle form field change
   */
  const handleFieldChange = useCallback((fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData({});
  }, []);

  /**
   * Submit form (create record)
   */
  const submitForm = useCallback(async (additionalData = {}) => {
    try {
      setIsSubmitting(true);

      // Merge form data with additional data
      const recordData = {
        ...formData,
        ...additionalData
      };

      logger.debug('Submitting form data:', recordData);

      // Sanitize data
      const sanitized = sanitizeRecordData(recordData, DATE_FIELDS, ARRAY_FIELDS);
      
      // Remove null values
      const allowEmpty = ['status', 'type'];
      const cleaned = removeNullValues(sanitized, allowEmpty);

      logger.debug('Cleaned record data:', cleaned);

      // Submit based on type
      let result;
      if (type === 'payment') {
        result = await tableApi.createPaymentReminder(cleaned);
      } else {
        result = await tableApi.createRecord(apiParams, cleaned);
      }

      toast.success('Record created successfully!');
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result.data);
      }

      // Reset form
      resetForm();
      setIsOpen(false);

      return result;

    } catch (error) {
      logger.error('Error submitting form:', error);
      
      if (error.response) {
        toast.error(`Failed to create record: ${error.response.data.error || error.response.data.message || 'Unknown error'}`);
      } else {
        toast.error(`Failed to create record: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, apiParams, type, onSuccess, resetForm]);

  /**
   * Open form modal
   */
  const openForm = useCallback((initialData = {}) => {
    initializeForm(initialData);
    setIsOpen(true);
  }, [initializeForm]);

  /**
   * Close form modal
   */
  const closeForm = useCallback(() => {
    setIsOpen(false);
    resetForm();
  }, [resetForm]);

  return {
    formData,
    isSubmitting,
    isOpen,
    initializeForm,
    handleFieldChange,
    resetForm,
    submitForm,
    openForm,
    closeForm
  };
};