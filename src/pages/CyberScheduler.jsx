import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, getDay, isBefore, startOfDay } from 'date-fns';
import './CyberScheduler.css';
import '../components/CyberContactForm.css';

function CyberScheduler() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [projectType, setProjectType] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setEmail(searchParams.get('email') || '');
        setProjectType(searchParams.get('type') || '');
        setDescription(searchParams.get('desc') || '');
    }, [searchParams]);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [step, setStep] = useState(1); // 1: Date/Time, 2: Confirm, 3: Success/Error
    const [submitStatus, setSubmitStatus] = useState('idle');
    const [loadingText, setLoadingText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loadingSequence = [
        '> AUTHENTICATING CALENDAR API...',
        '> SCANNING FREE/BUSY UPLINKS...',
        '> ISOLATING TIME VECTOR...',
        '> TRANSMITTING CALENDAR INVITATION...'
    ];

    // Calendar Render Logic
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    
    const onDateClick = async (day) => {
        if (isBefore(startOfDay(day), startOfDay(new Date()))) return; // Past dates disabled
        if (getDay(day) === 0 || getDay(day) === 6) return; // Weekends disabled (optional, depends on logic)
        
        setSelectedDate(day);
        setSelectedSlot(null);
        
        // Mocking API fetch for available slots (replace with real call later)
        setAvailableSlots(['Loading...']);
        try {
            const res = await fetch(`/api/availability?date=${format(day, 'yyyy-MM-dd')}`);
            if(res.ok) {
                const data = await res.json();
                setAvailableSlots(data.slots || []);
            } else {
                // Fallback fixed slots if API missing
                setAvailableSlots(['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '05:30 PM']);
            }
        } catch(e) {
            setAvailableSlots(['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '05:30 PM']);
        }
    };

    const renderHeader = () => {
        return (
            <div className="calendar-header">
                <button className="calendar-nav-btn mono" onClick={prevMonth} disabled={isBefore(startOfMonth(currentMonth), startOfMonth(new Date()))}>
                    {'<'}
                </button>
                <span>{format(currentMonth, 'MMMM yyyy').toUpperCase()}</span>
                <button className="calendar-nav-btn mono" onClick={nextMonth}>
                    {'>'}
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = 'EEE';
        const startDate = startOfWeek(currentMonth);
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="calendar-day-header" key={i}>
                    {format(addDays(startDate, i), dateFormat).toUpperCase()}
                </div>
            );
        }
        return <div className="calendar-grid" style={{ marginBottom: '1rem' }}>{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;
                
                const isPast = isBefore(startOfDay(cloneDay), startOfDay(new Date()));
                const isWeekend = getDay(cloneDay) === 0 || getDay(cloneDay) === 6;
                const isDisabled = !isSameMonth(day, monthStart) || isPast || isWeekend;
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                days.push(
                    <div
                        className={`calendar-day ${!isSameMonth(day, monthStart) ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isDisabled && isSameMonth(day, monthStart) ? 'disabled' : ''}`}
                        key={day}
                        onClick={() => !isDisabled ? onDateClick(cloneDay) : null}
                    >
                        {isSameMonth(day, monthStart) ? formattedDate : ''}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="calendar-grid" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="calendar-body">{rows}</div>;
    };

    const handleConfirmBooking = async () => {
        setStep(3);
        setSubmitStatus('loading');
        setErrorMessage('');
        
        for (let i = 0; i < loadingSequence.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setLoadingText(loadingSequence[i]);
        }

        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: format(selectedDate, 'yyyy-MM-dd'),
                    time: selectedSlot,
                    email,
                    projectType,
                    description
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to sync calendar');

            setSubmitStatus('success');
        } catch(err) {
            setSubmitStatus('error');
            setErrorMessage(err.message || 'System uplink failed.');
        }
    };

    return (
        <div className="scheduler-container">
            <div className="scheduler-console">
                <button className="console-close mono" onClick={() => window.location.href='/'}>[X] RETURN_TO_BASE</button>
                <div className="console-reticle top-left"></div>
                <div className="console-reticle top-right"></div>
                <div className="console-reticle bottom-left"></div>
                <div className="console-reticle bottom-right"></div>
                
                <div className="console-label mono">SYS.COMMS.SCHEDULER_V1.0</div>
                
                <div className="scheduler-header">
                    <h1 className="scheduler-title">SCHEDULE UPLINK <span className="caret-pulse">_</span></h1>
                    <div className="scheduler-subtitle">Identify temporal coordinates</div>
                </div>

                {step === 1 && (
                    <div className="scheduler-layout">
                        <div className="calendar-section">
                            {renderHeader()}
                            {renderDays()}
                            {renderCells()}
                        </div>
                        
                        {selectedDate && (
                            <div className="time-section">
                                <div className="time-slot-header">
                                    > {format(selectedDate, 'MMMM d, yyyy').toUpperCase()}
                                </div>
                                <div className="time-slots">
                                    {availableSlots.length > 0 && availableSlots[0] === 'Loading...' ? (
                                        <div className="mono">SCANNING SLOTS...</div>
                                    ) : availableSlots.length === 0 ? (
                                        <div className="mono" style={{color: 'var(--text-muted)'}}>NO SLOTS AVAILABLE</div>
                                    ) : (
                                        availableSlots.map((slot, i) => (
                                            <button 
                                                key={i} 
                                                className={`time-slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                                                onClick={() => setSelectedSlot(slot)}
                                            >
                                                {slot}
                                            </button>
                                        ))
                                    )}
                                </div>
                                
                                {selectedSlot && (
                                    <button 
                                        className="btn-primary" 
                                        style={{marginTop: 'auto'}}
                                        onClick={() => setStep(2)}
                                    >
                                        CONFIRM_SLOT
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="confirmation-section">
                        <h2 className="console-header mono" style={{fontSize: '1.2rem', marginTop: 0}}>VERIFY TRANSMISSION DATA</h2>
                        
                        <div className="confirmation-details">
                            <div className="detail-row">
                                <div className="detail-label">DATE_TIME:</div>
                                <div className="detail-value">{format(selectedDate, 'EEEE, MMMM d, yyyy')} @ {selectedSlot}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">CONTACT_NODE:</div>
                                <div className="detail-value">{email || '[AWAITING INPUT]'}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">SYS_TYPE:</div>
                                <div className="detail-value">{projectType || 'Standard'}</div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="mono input-label">> IDENTITY VERIFICATION (EMAIL) // </label>
                            <input 
                                type="email" 
                                className="console-input mono" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operable@domain.sys"
                                required
                            />
                        </div>

                        <div className="action-buttons">
                            <button className="btn-secondary" onClick={() => setStep(1)}>ABORT_SELECTION</button>
                            <button className="btn-primary" onClick={handleConfirmBooking} disabled={!email}>INITIALIZE_SYNC</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="terminal-loading-state" style={{minHeight: '300px'}}>
                        {submitStatus === 'loading' && (
                            <>
                                <h2 className="loading-header mono">[SYNCING WITH GOOGLE SERVERS]</h2>
                                <div className="loading-sequence mono">
                                    {loadingSequence.slice(0, loadingSequence.indexOf(loadingText) + 1).map((text, idx) => (
                                        <div key={idx} className="loading-line">{text}</div>
                                    ))}
                                    <span className="caret-pulse block-caret mt-4"></span>
                                </div>
                            </>
                        )}
                        
                        {submitStatus === 'success' && (
                            <>
                                <h2 className="loading-header mono" style={{ color: '#00ff88' }}>[UPLINK SECURED]</h2>
                                <div className="loading-sequence mono">
                                    <div className="loading-line" style={{ color: '#00ff88' }}>> GOOGLE MEET INVITATION DISPATCHED</div>
                                    <div className="loading-line" style={{ color: '#00ff88', marginTop: '8px' }}>> CHECK INBOX FOR CALENDAR EVENT</div>
                                    <div className="loading-line" style={{ color: '#555', marginTop: '24px' }}>// Ending connection...</div>
                                </div>
                                <button className="console-submit-btn mono" style={{marginTop:'3rem'}} onClick={() => window.location.href='/'}>
                                    RETURN_TO_BASE
                                </button>
                            </>
                        )}

                        {submitStatus === 'error' && (
                            <>
                                <h2 className="loading-header mono" style={{ color: '#ff4444' }}>[UPLINK FAILED]</h2>
                                <div className="loading-sequence mono">
                                    <div className="loading-line" style={{ color: '#ff4444' }}>> ERROR: {errorMessage}</div>
                                    <div className="loading-line" style={{ color: '#888', marginTop: '8px' }}>> SYNC REJECTED. MANUAL SCHEDULING REQUIRED.</div>
                                </div>
                                <div className="action-buttons">
                                    <button className="btn-secondary" onClick={() => setStep(1)}>RETRY</button>
                                </div>
                            </>
                        )}
                    </div>
                )}
                
            </div>
        </div>
    );
}

export default CyberScheduler;
