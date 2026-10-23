import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Instagram } from "lucide-react";
import { navigateSmooth } from "../../utils/helperFunctions";
import {
  getEventById,
  getGallery,
  getRelatedEvents,
} from "../../services/eventsService";

import EventGallery from "./components/EventGallery";
import EventHero from "./components/EventHero";
import EventInfoCard from "./components/EventInfoCard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import RelatedEvents from "./components/RelatedEvents";

function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [pageData, setPageData] = useState({
    event: null,
    gallery: [],
    relatedEvents: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isFromHome = location.state?.from === "home";
  const path = isFromHome ? "/" : "/events";

  useEffect(() => {
    let isMounted = true;

    async function loadEventDetails() {
      setLoading(true);
      setError("");

      try {
        const event = await getEventById(id);

        if (!event) {
          if (isMounted) {
            setPageData({
              event: null,
              gallery: [],
              relatedEvents: [],
            });
          }
          return;
        }

        const [galleryResult, relatedResult] = await Promise.allSettled([
          getGallery(id),
          getRelatedEvents(id),
        ]);

        if (!isMounted) return;

        setPageData({
          event,
          gallery:
            galleryResult.status === "fulfilled" &&
            Array.isArray(galleryResult.value)
              ? galleryResult.value
              : [],
          relatedEvents:
            relatedResult.status === "fulfilled" &&
            Array.isArray(relatedResult.value)
              ? relatedResult.value
              : [],
        });

        if (galleryResult.status === "rejected") {
          console.error("Failed to load event gallery:", galleryResult.reason);
        }

        if (relatedResult.status === "rejected") {
          console.error("Failed to load related events:", relatedResult.reason);
        }
      } catch (err) {
        console.error("Failed to load event details:", err);

        if (isMounted) {
          setError("Unable to load this event. Please try again.");
          setPageData({
            event: null,
            gallery: [],
            relatedEvents: [],
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadEventDetails();
    } else {
      setPageData({
        event: null,
        gallery: [],
        relatedEvents: [],
      });
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const backToPrevious = () => {
    const scrollPositionY = sessionStorage.getItem("scrollPositionY");

    navigateSmooth(navigate, path, "", parseInt(scrollPositionY || "0", 10));

    if (scrollPositionY) {
      sessionStorage.removeItem("scrollPositionY");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  const { event, gallery, relatedEvents } = pageData;

  if (error || !event) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-6 py-20 text-center sm:px-8 lg:px-12">
        <h2 className="text-2xl font-semibold">
          {error ? "Unable to load event" : "Event not found"}
        </h2>

        <p className="mt-3 text-quaternary">
          {error || "This event may have been removed or is unavailable."}
        </p>

        <button
          type="button"
          onClick={backToPrevious}
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isFromHome ? "Go Back" : "Back to Events"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
      <button
        type="button"
        onClick={backToPrevious}
        className="group mb-6 inline-flex items-center rounded-full border-0 bg-transparent px-0 py-1 text-quaternary hover:text-primary focus:outline-none focus:ring-0 sm:mb-8"
      >
        <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
        {isFromHome ? "Go Back" : "All Events"}
      </button>

      {/* Banner: event title only */}
      <EventHero event={event} />

      {/* About Event */}
      <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:gap-8">
        <section className="w-full rounded-[20px] border border-secondary bg-complementPrimary p-4 font-sans sm:p-6 lg:p-7">
          

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div>
            <h2 className="font-playfair text-3xl font-medium mb-4">About Event</h2>
            <p className="whitespace-pre-line text-quaternary">
              {(() => {
                const description =
                  event.fullDescription ||
                  event.description ||
                  "No event description available.";

                return (
                  description.charAt(0).toUpperCase() + description.slice(1)
                );
              })()}
            </p>
              </div>
            <EventInfoCard event={event} />
          </div>

          {/* {event.portfolioLink && (
            <div className="mt-5 flex justify-end">
              <a
                href={event.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open event portfolio or Instagram page"
                title="View event portfolio"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-secondary transition hover:border-primary hover:bg-complementSecondary"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          )} */}
        </section>

        {/* Event Gallery with Add Photos inside its inner box */}
        <section className="w-full rounded-[24px] border border-secondary bg-complementPrimary/70 p-3 shadow-sm sm:p-4">
          <EventGallery
            photos={gallery}
            onAddPhotos={() => navigate(`/events/${id}/upload`)}
          />
        </section>

        {/* Related Events */}
        <RelatedEvents events={relatedEvents} />
      </div>
    </div>
  );
}

export default EventPage;
