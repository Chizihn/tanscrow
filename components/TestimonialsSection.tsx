"use client";

import { AnimatedSection } from "./ui/AnimatedSection";

type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  delay: number;
};

function Testimonial({ quote, author, role, delay }: TestimonialProps) {
  return (
    <AnimatedSection delay={delay} className="card h-full flex flex-col">
      <div className="mb-4 text-primary">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.59 4.59A2 2 0 1 1 11 8H8.5C8.5 10.5 10 12 10 12H11C11 12 12 12 12 13V19C12 20 11 20 11 20H5C5 20 4 20 4 19V13C4 12 5 12 5 12C5 12 8 9.5 8 5V4.59C8 4.59 8.5 4 9.59 4.59ZM19.59 4.59A2 2 0 1 1 21 8H18.5C18.5 10.5 20 12 20 12H21C21 12 22 12 22 13V19C22 20 21 20 21 20H15C15 20 14 20 14 19V13C14 12 15 12 15 12C15 12 18 9.5 18 5V4.59C18 4.59 18.5 4 19.59 4.59Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">{role}</p>
      </div>
    </AnimatedSection>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Tanscrow has completely transformed how I conduct business online. The escrow service gives me peace of mind knowing my payments are secure until I receive exactly what I ordered.",
      author: "Sarah Johnson",
      role: "E-commerce Business Owner",
    },
    {
      quote:
        "As a freelancer, getting paid can sometimes be stressful. With Tanscrow, I know my clients are serious and my payment is guaranteed once I deliver my work.",
      author: "Michael Chen",
      role: "Freelance Designer",
    },
    {
      quote:
        "We use Tanscrow for all our high-value transactions. Their dispute resolution service has saved us countless times when dealing with new suppliers.",
      author: "David Rodriguez",
      role: "Procurement Manager",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join thousands of satisfied users who trust Tanscrow for their
            secure transactions.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={testimonial.author}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
