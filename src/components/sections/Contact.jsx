import { useState, useRef } from 'react';
import '../styles/contact.css';

const INITIAL_OUTPUT = [
  { type: 'sys',  text: '┌─────────────────────────────────────┐' },
  { type: 'sys',  text: '│   HARIHARAN K // Contact Terminal   │' },
  { type: 'sys',  text: '└─────────────────────────────────────┘' },
  { type: 'info', text: '' },
  { type: 'info', text: 'Welcome! Send me a message below.' },
  { type: 'info', text: 'Fill in your name, email, and message.' },
  { type: 'info', text: '' },
];

const SOCIAL = [
  { icon: '⌥', label: 'GitHub',    value: 'github.com/hariharan-k', href: '#' },
  { icon: '⚡', label: 'LinkedIn',  value: 'linkedin.com/in/hariharan-k', href: '#' },
  { icon: '✉', label: 'Email',     value: 'hariharan@example.com', href: 'mailto:hariharan@example.com' },
];

export default function Contact() {
  const [output,    setOutput]   = useState(INITIAL_OUTPUT);
  const [name,      setName]     = useState('');
  const [email,     setEmail]    = useState('');
  const [message,   setMessage]  = useState('');
  const [sending,   setSending]  = useState(false);
  const [sent,      setSent]     = useState(false);
  const outputRef = useRef(null);

  const addLine = (type, text) => {
    setOutput(prev => [...prev, { type, text }]);
    setTimeout(() => {
      if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }, 50);
  };

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      addLine('err', '✗ Error: All fields are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addLine('err', '✗ Error: Invalid email address.');
      return;
    }
    setSending(true);
    addLine('cmd', `$ send --name "${name}" --email "${email}" --msg "..."`);
    addLine('info', '  Establishing connection...');

    await new Promise(r => setTimeout(r, 800));
    addLine('info', '  Encrypting payload...');
    await new Promise(r => setTimeout(r, 600));
    addLine('info', '  Transmitting...');
    await new Promise(r => setTimeout(r, 700));
    addLine('ok',  '✓ Message delivered successfully!');
    addLine('ok',  `  I'll get back to you at ${email} soon.`);
    addLine('info', '');

    setSending(false);
    setSent(true);
    setName(''); setEmail(''); setMessage('');
  };

  return (
    <section id="contact" className="section contact">
      <h2 className="section-title">Contact</h2>
      <p className="section-subtitle">// connect.init() —— open channel</p>

      <div className="contact-inner">
        {/* Left info */}
        <div className="contact-info">
          <p className="contact-tagline">
            I'm always open to interesting conversations, collaborations, internships, or project ideas. Drop a message!
          </p>
          <div className="contact-links">
            {SOCIAL.map(({ icon, label, value, href }) => (
              <a key={label} href={href} className="contact-link-item" data-cursor="pointer">
                <span className="contact-link-icon">{icon}</span>
                <div>
                  <span className="contact-link-label">{label}</span>
                  {value}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div className="terminal-window">
          <div className="terminal-titlebar">
            <div className="terminal-dot red" />
            <div className="terminal-dot yellow" />
            <div className="terminal-dot green" />
            <span className="terminal-title-text">hariharan@ai-lab:~$</span>
          </div>

          <div className="terminal-body">
            <div className="terminal-output" ref={outputRef}
              style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {output.map((line, i) => (
                <p key={i} className={`terminal-line ${line.type}`}>{line.text}</p>
              ))}
            </div>

            {!sent ? (
              <div className="terminal-form">
                <div className="terminal-field-wrap">
                  <span className="terminal-prompt">name&nbsp;&nbsp;&gt;</span>
                  <input
                    className="terminal-input"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={sending}
                  />
                </div>
                <div className="terminal-field-wrap">
                  <span className="terminal-prompt">email&nbsp;&gt;</span>
                  <input
                    className="terminal-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={sending}
                    type="email"
                  />
                </div>
                <div className="terminal-field-wrap">
                  <span className="terminal-prompt">msg&nbsp;&nbsp;&nbsp;&gt;</span>
                  <input
                    className="terminal-input"
                    placeholder="Your message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    disabled={sending}
                    onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                  />
                </div>
                <button
                  className="terminal-send-btn"
                  onClick={handleSend}
                  disabled={sending}
                >
                  {sending ? 'Transmitting...' : '$ execute send_message'}
                </button>
              </div>
            ) : (
              <div className="terminal-form">
                <p className="terminal-line ok">✓ Session complete. Message sent!</p>
                <button className="terminal-send-btn" onClick={() => { setSent(false); setOutput(INITIAL_OUTPUT); }}>
                  $ new_message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
