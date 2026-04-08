import React from 'react';
import './TourDates.css';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const tours = [
  { id: 1, date: 'OCT 12', city: 'Los Angeles, CA', venue: 'The Echo', status: 'AVAILABLE' },
  { id: 2, date: 'OCT 15', city: 'San Francisco, CA', venue: 'Cyber Club', status: 'SOLD OUT' },
  { id: 3, date: 'OCT 20', city: 'Tokyo, JP', venue: 'Neo Shibuya', status: 'AVAILABLE' },
  { id: 4, date: 'NOV 05', city: 'London, UK', venue: 'The Underground', status: 'AVAILABLE' },
  { id: 5, date: 'NOV 12', city: 'Berlin, DE', venue: 'Techno Dome', status: 'LOW TICKETS' }
];

const TourDates = () => {
  return (
    <div className="component-container glass tour-container">
      <div className="tour-header">
        <h2 className="section-title" style={{borderBottom: 'none', marginBottom: 0}}>TOUR DATES</h2>
        <button className="btn btn-outline small-btn">WATCH TRAILER</button>
      </div>
      
      <div className="tours-list">
        {tours.map((tour) => (
          <div key={tour.id} className={`tour-item ${tour.status === 'SOLD OUT' ? 'sold-out' : ''}`}>
            <div className="tour-date">
              <Calendar size={16} className="text-secondary mr-2" />
              <span>{tour.date}</span>
            </div>
            
            <div className="tour-location">
              <div className="tour-city">{tour.city}</div>
              <div className="tour-venue">
                <MapPin size={14} className="text-secondary inline-icon" />
                {tour.venue}
              </div>
            </div>
            
            <div className="tour-status">
              {tour.status === 'SOLD OUT' ? (
                <span className="status-badge sold-out">SOLD OUT</span>
              ) : (
                <button className="btn ticket-btn">
                  TICKETS <ArrowRight size={14} style={{marginLeft: '4px'}} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="tour-footer">
        <a href="#" className="view-all-link">VIEW ALL DATES</a>
      </div>
    </div>
  );
};

export default TourDates;
