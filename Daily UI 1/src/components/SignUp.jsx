import React, { useState } from 'react';
import ClickSpark from './ClickSpark';
import Wrapper from "@/components/background-shaders";


function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Sign Up with: ${JSON.stringify(formData)}`);
    setSubmitted(true);
    setFormData({ name: '', email: '', password: '' }); // Reset form
  };

  return (
    <Wrapper>
      <div className="flex items-center justify-center">
        <ClickSpark
          sparkColor="#fff"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          {submitted ? (
            <div className="text-center text-xl text-green-600">
              Thank you for signing up!
            </div>
          ) : (
            <form
              className=" p-8 rounded shadow-md max-w-md w-full"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
              <input
                className="w-full px-3 py-2 border rounded mb-4"
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className="w-full px-3 py-2 border rounded mb-4"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className="w-full px-3 py-2 border rounded mb-4"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Sign Up
              </button>
            </form>
          )}
        </ClickSpark>
      </div>
    </Wrapper>
  );
}

export default SignUp;
