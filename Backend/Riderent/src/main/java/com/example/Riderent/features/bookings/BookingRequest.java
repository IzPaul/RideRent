package com.example.Riderent.features.bookings;

import java.time.LocalDate;

public class BookingRequest {
    private String bookerEmail;
    private Long vehicleId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String extraInfo;

    public String getBookerEmail() { return bookerEmail; }
    public void setBookerEmail(String bookerEmail) { this.bookerEmail = bookerEmail; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getExtraInfo() { return extraInfo; }
    public void setExtraInfo(String extraInfo) { this.extraInfo = extraInfo; }
}