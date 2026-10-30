
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { EventService } from '../../features/public/events/services/event.service';
import { Event } from '../../features/public/events/models/event.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  readonly currentYear = new Date().getFullYear();
  
  private eventService = inject(EventService);

  // Reactive UI state
  events = signal<Event[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.eventService.getEvents().subscribe({

      next: (response: Event[]) => {

        console.log('Events API response:', response);

        const today = this.getTodayDate();

        const upcomingEvents = response
          .filter(event =>
            event.status?.toLowerCase() === 'published' &&
            event.eventDate?.substring(0, 10) >= today
          )
          .sort((a, b) =>
            a.eventDate.localeCompare(b.eventDate)
          )
          .slice(0, 3);

        this.events.set(upcomingEvents);

        this.isLoading.set(false);

        console.log('Upcoming events loaded:', upcomingEvents);
      },

      error: (error) => {

        console.error('Error loading events:', error);

        this.errorMessage.set(
          'Unable to load upcoming events. Please try again later.'
        );

        this.isLoading.set(false);
      }

    });
  }

  private getTodayDate(): string {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
