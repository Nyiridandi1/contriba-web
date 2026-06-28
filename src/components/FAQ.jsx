import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, HelpCircle } from "lucide-react";
import "./FAQ.css";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How do I create an event on Contriba?",
      answer:
        "Create your event in a few minutes by adding the event name, goal amount, date and details. Contriba then gives you one beautiful link to share with family, friends and guests.",
    },
    {
      question: "Which payment methods does Contriba support?",
      answer:
        "Contriba is designed for Rwanda with MTN MoMo and Airtel Money support. More payment options like cards can be added as the platform grows.",
    },
    {
      question: "Can I track every contribution?",
      answer:
        "Yes. Event owners can see contribution progress, contributor details, amounts received and goal status from one clean dashboard.",
    },
    {
      question: "Is Contriba secure?",
      answer:
        "Yes. Contriba is built around trusted payment flows, organized records and clear event tracking so every contribution is easier to manage safely.",
    },
    {
      question: "Can I share my event on WhatsApp?",
      answer:
        "Yes. You can share your event link on WhatsApp, Instagram, Facebook, SMS, email or anywhere your contributors are.",
    },
    {
      question: "Is Contriba only for weddings?",
      answer:
        "No. Contriba works for weddings, graduations, birthdays, church events, family support, community fundraisers and many other meaningful moments.",
    },
  ];

  return (
    <section className="faq reveal">
      <div className="faq-glow faq-glow-one"></div>
      <div className="faq-glow faq-glow-two"></div>

      <div className="section-title faq-title">
        <span>FAQ</span>

        <h2>Questions people ask before using Contriba.</h2>

        <p>
          Everything you need to know about creating events, sharing links,
          receiving contributions and tracking support clearly.
        </p>
      </div>

      <div className="faq-shell">
        <div className="faq-side-card premium-hover">
          <div className="faq-side-icon">
            <HelpCircle size={28} />
          </div>

          <h3>Still have questions?</h3>

          <p>
            We are here to help you understand how Contriba can support your
            next event.
          </p>

          <Link
            to="/contact"
            className="contact-btn"
          >
            Contact Support
          </Link>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => (
            <button
              className={`faq-item ${
                openIndex === index ? "active" : ""
              } premium-hover`}
              key={item.question}
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <div className="faq-question">
                <h3>{item.question}</h3>

                <span className="faq-toggle">
                  {openIndex === index ? (
                    <Minus size={22} />
                  ) : (
                    <Plus size={22} />
                  )}
                </span>
              </div>

              <p>{item.answer}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;