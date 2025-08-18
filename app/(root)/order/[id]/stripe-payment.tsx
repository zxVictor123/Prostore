import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import { useTheme } from 'next-themes';
import { useStripe } from '@stripe/react-stripe-js';
import { useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

const StripePayment = ({
  priceInCents,
  orderId,
  clientSecret,
}: {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
}) => {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

    const {theme, systemTheme} = useTheme()
    
  // Stripe Form Component
  const StripeForm = () => {
    const stripe = useStripe()
    const elements = useElements()

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [email, setEmail] = useState('')
    
    return (
      <form className='space-y-4'>
        <div className='text-xl'>Stripe Checkout</div>
        {errorMessage && <div className='text-destructive'>{errorMessage}</div>}
      </form>
    )
  }
  return <Elements options={{
    clientSecret,
    appearance: {
        theme: theme=== 'dark' ? 'night' : theme === 'light' ? 'stripe' :  systemTheme === 'light' ? 'stripe' : 'night'
    }
  }}>STRIPE FORM</Elements>;
};

export default StripePayment;
