import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);
    const header = screen.queryByText(/Contact Form/i);

    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/Contact Form/i);
    expect(header).toBeTruthy();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>)

    const firstNameInput = screen.getByLabelText(/First Name/i);
    userEvent.type(firstNameInput, 'asdf');

    const errorMessage = await screen.findAllByTestId('error');
    expect(errorMessage).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm/>);

  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);

  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
  })


});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm/>);

  const firstName = screen.getByLabelText(/First Name/i);
  userEvent.type(firstName,'DeQuavion');
  const lastName = screen.getByLabelText(/Last Name/i);
  userEvent.type(lastName,'Wilburn');

  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);

  const errorMessage = await screen.findAllByTestId('error');
  expect(errorMessage).toHaveLength(1);

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm/>);

  const emailInput = screen.getByLabelText(/Email/i)
  userEvent.type(emailInput, 'abcdefg@hotmail')

  const errorMessage = await screen.findByText(/email must be a valid email address/i);
  expect(errorMessage).toBeInTheDocument();

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm/>);

  const first = screen.getByLabelText(/First Name/i);
  userEvent.type(first, 'Dequavion');
  const email = screen.getByLabelText(/Email/i);
  userEvent.type(email,'asdfgh@gmail.com');

  const button = screen.getByRole('button');
  userEvent.click(button);

  const error = await screen.findByText(/lastName is a required field/i);
  expect(error).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm/>);

  const firstName = screen.getByLabelText(/First Name/i);
  const lastName = screen.getByLabelText(/Last Name/i);
  const email = screen.getByLabelText(/Email/i);
  const submitBtn = screen.getByRole('button');

  userEvent.type(firstName, 'DeQuavion');
  userEvent.type(lastName, 'Wilburn');
  userEvent.type(email, 'asdfg@asd.com');
  userEvent.click(submitBtn);

  await waitFor(() => {
    const firstNameInput = screen.queryByText('DeQuavion');
    const lastNameInput = screen.queryByText('Wilburn');
    const emailInput = screen.queryByText('asdfg@asd.com');
    const messageInput = screen.queryByTestId('messageInput');

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageInput).not.toBeInTheDocument();

  })
});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm/>);

  const firstNameField = screen.getByLabelText(/First Name/i);
  const lastNameField = screen.getByLabelText(/Last Name/i);
  const emailField = screen.getByLabelText(/Email/i);
  const messageField = screen.getByLabelText(/Message/i);

  userEvent.type(firstNameField, 'DeQuavion');
  userEvent.type(lastNameField, 'Wilburn');
  userEvent.type(emailField, 'asdfg@asdf.com');
  userEvent.type(messageField, 'This is a message');

  const button = screen.getByRole('button');
  userEvent.click(button);

  await waitFor(() => {
    const firstName = screen.queryByText('DeQuavion');
    const lastName = screen.queryByText('Wilburn');
    const email = screen.queryByText('asdfg@asdf.com');
    const message = screen.queryByText('This is a message');

    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(message).toBeInTheDocument();

  })
});