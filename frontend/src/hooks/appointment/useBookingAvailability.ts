import { useQuery } from "@tanstack/react-query";
import { publicAvailabilityService } from "@/services/appointment/availability.service";

export const useBookingAvailability = () => {
  return useQuery({
    queryKey: ["booking-availability"],
    queryFn: async () => {
      try {
        const [availability, bookedSlots] = await Promise.all([
          publicAvailabilityService.getBarberAvailability(),
          publicAvailabilityService.getBookedSlots(),
        ]);

        return {
          ...availability,
          bookedSlots: bookedSlots.bookedSlots,
        };
      } catch (error) {
        console.error("Error fetching availability:", error);
        throw error;
      }
    },
  });
};
