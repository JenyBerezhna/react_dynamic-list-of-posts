import React, { useState } from 'react';
import classNames from 'classnames';
import { CommentData } from '../types/Comment';

export interface Props {
  onSubmit: (comment: CommentData) => Promise<void> | void;
}

export const NewCommentForm: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    body?: string;
    submit?: string;
  }>({});

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Omit<typeof errors, 'submit'> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!body.trim()) {
      newErrors.body = 'Enter some text';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrors(prev => ({ ...prev, submit: undefined }));

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));

      return;
    }

    setLoading(true);

    try {
      await onSubmit({ name, email, body });

      setBody('');
      setErrors({});
      setSubmitted(false);
    } catch {
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to add comment. Please try again.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setBody('');
    setErrors({});
    setSubmitted(false);
  };

  const clearFieldError = (field: 'name' | 'email' | 'body') => {
    if (submitted && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form
      data-cy="NewCommentForm"
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {/* Name */}
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            id="comment-author-name"
            value={name}
            onChange={e => {
              setName(e.target.value);
              clearFieldError('name');
            }}
            placeholder="Name Surname"
            className={classNames('input', { 'is-danger': errors.name })}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>
          {errors.name && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {errors.name && (
          <p className="help is-danger" data-cy="ErrorMessage">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            id="comment-author-email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              clearFieldError('email');
            }}
            placeholder="email@test.com"
            className={classNames('input', { 'is-danger': errors.email })}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
          {errors.email && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {errors.email && (
          <p className="help is-danger" data-cy="ErrorMessage">
            {errors.email}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>
        <div className="control">
          <textarea
            id="comment-body"
            value={body}
            onChange={e => {
              setBody(e.target.value);
              clearFieldError('body');
            }}
            placeholder="Type comment here"
            className={classNames('textarea', { 'is-danger': errors.body })}
          />
        </div>
        {errors.body && (
          <p className="help is-danger" data-cy="ErrorMessage">
            {errors.body}
          </p>
        )}
      </div>

      {/* Submit error */}
      {errors.submit && (
        <p className="help is-danger" data-cy="SubmitError">
          {errors.submit}
        </p>
      )}

      {/* Buttons */}
      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button is-link', { 'is-loading': loading })}
          >
            Add
          </button>
        </div>
        <div className="control">
          <button type="reset" className="button is-link is-light">
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
