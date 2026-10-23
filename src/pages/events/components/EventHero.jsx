
import PropTypes from "prop-types";
import noiseImage from "../../../assets/images/noise.png";

function EventHero({ event }) {
  return (
    <section className="overflow-hidden rounded-[12px] bg-complementSecondary">
      <div className="relative min-h-[300px] sm:min-h-[340px] md:min-h-[420px]">
        <div
          style={{ backgroundColor: event.thumbnailColor }}
          className="absolute inset-0"
        >
          <img
            src={noiseImage}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full contrast-200 opacity-30 mix-blend-overlay md:opacity-40"
          />
        </div>

        <img
          src={event.bannerImage}
          alt={`${event.title} event banner`}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-[1] flex min-h-[300px] flex-col justify-end p-5 sm:min-h-[340px] sm:p-6 md:min-h-[420px] md:p-10">
          <h1 className="font-playfair text-3xl font-medium leading-tight text-white uppercase sm:text-4xl md:text-[44px]">
            {event.title}
          </h1>
        </div>
      </div>
    </section>
  );
}

EventHero.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventHero;
