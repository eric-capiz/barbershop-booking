import { useQuery } from "@tanstack/react-query";
import { publicAvailabilityService } from "@/services/appointment/availability.service";

export const useBookingAvailability = () => {
  return useQuery({
    queryKey: ["booking-availability"],
    queryFn: () => publicAvailabilityService.getBarberAvailability(),
  });
};
