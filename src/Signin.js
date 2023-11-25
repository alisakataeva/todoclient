import React from 'react'
import Layout from './Layout'
import { SignInForm } from './features/auth/SignInForm'

export default function Signin() {
  return (
    <Layout title="Sign in:">
      <SignInForm />
    </Layout>
  );
}
