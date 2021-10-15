import React, { useState, useEffect } from 'react';
import useInterval from 'use-interval';
import {
  AIRTABLE_TYPE_MAP,
  REACT_APP_BLUEPRINTS_URL,
  REACT_APP_RESULTS_URL,
  URL_HEADERS,
} from '../util/helpers.js';

export default function InputForm() {
  const [formBlueprints, setFormBlueprints] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  
  useInterval(() => {
    setIsSuccess(false);
  }, 1e4);
  
  useInterval(() => {
    setIsEmpty(false);
  }, 1e4);

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const data = await fetch(REACT_APP_BLUEPRINTS_URL, {
        method: 'GET',
        headers: URL_HEADERS,
      })
      .then(data => data.json());

      setFormBlueprints(data.records.sort((a, b) => a.fields.Order - b.fields.Order));
    } catch (e) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length < 1) {
      setIsEmpty(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const body = JSON.stringify({
        fields: {
          "Entry Data in JSON": JSON.stringify(formData, null, 2),
        }
      });

      await fetch(REACT_APP_RESULTS_URL, {
        method: 'POST',
        headers: URL_HEADERS,
        body,
      });
    } catch (e) {
      setIsError(true);
    }

    setIsLoading(false);
    setFormData({});
    setIsSuccess(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-container center-div">
        Loading...
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex-container center-div">
        An error has been encountered. Please refresh and try again.
      </div>
    );
  }

  const generateFields = () => {
    return (
      <div className="flex-container form-content">
        <h3>Add an Airtable record</h3>
        {
          formBlueprints.map((f) => {
            const { fields: { Label, Type } } = f;
            return (
              <div className="flex-container item" key={Label}>
                <label htmlFor={Label} className="label">{Label}:</label>
                <input
                  type={AIRTABLE_TYPE_MAP[Type] || 'text'}
                  className="input-field"
                  id={Label}
                  onChange={e => setFormData({ ...formData, [Label]: e.target.value })}
                />
              </div>
            );
          })
        }
        <button type="submit" className="submit-button">Submit</button>
        <div className="empty-div" style={{ 'visibility': isEmpty ? 'visible' : 'hidden' }}>
          Please enter some data before submitting.
        </div>
        <div className="success-div" style={{ 'visibility': isSuccess ? 'visible' : 'hidden' }}>
          Submission successful!
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-container center-div">
        { generateFields() }
      </div>
    </form>
  );
}