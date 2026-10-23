
import PropTypes from "prop-types";
import { Instagram } from "lucide-react";

function EventInfoCard({ event }) {
  const fields = [
    ["Date", event.date],
    ["Time", event.time],
    ["Venue", event.venue],
    ["Organizer", event.organizer],
  ].filter(([, value]) => value);

  return (
    <aside className="p-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-playfair text-2xl font-medium">
          Event Information
        </h2>

        {event.portfolioLink && (
          <a
            href={event.portfolioLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open event portfolio or Instagram page"
            title="View event portfolio"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary transition hover:border-primary hover:bg-complementSecondary"
          >
            <Instagram className="h-5 w-5" />
          </a>
        )}
      </div>

      <div className="flex flex-col divide-y divide-secondary bg-transparent">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 py-3 text-sm"
          >
            <span className="font-semibold text-quaternary">{label}</span>
            <span className="text-right text-primary">{value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

EventInfoCard.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventInfoCard;
