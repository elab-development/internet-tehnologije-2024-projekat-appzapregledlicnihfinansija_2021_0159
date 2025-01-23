<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Goal;
use App\Mail\GoalNotificationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Testing\RefreshDatabase;

class IncomeControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Testira slanje mejla kada se dostigne određeni procenat cilja.
     */
    public function test_send_goal_notification_mail()
    {
        // Fake za Mail
        Mail::fake();

        // Kreiraj korisnika i cilj
        $user = User::factory()->create();
        $goal = Goal::factory()->create([
            'user_id' => $user->id,
            'title' => 'Ušteda za putovanje',
            'target_amount' => 1000,
            'current_amount' => 800, // Trenutno 80%
        ]);

        // Prijavi korisnika
        $this->actingAs($user);

        // Pošalji POST zahtev za unos prihoda
        $response = $this->postJson('/api/incomes', [
            'amount' => 200, // Ukupno dostiže 100%
            'description' => 'Bonus',
            'source' => 'Posao',
            'currency' => 'USD',
            'date' => now()->toDateString(),
            'goal_id' => $goal->id,
        ]);

        // Proveri odgovor
        $response->assertStatus(201);

        // Proveri da li je mejl poslat za 100%
        Mail::assertSent(GoalNotificationMail::class, function ($mail) use ($user, $goal) {
            return $mail->hasTo($user->email) &&
                $mail->data['goalTitle'] === $goal->title &&
                $mail->data['percentage'] === 100;
        });

        // Osiguraj da je mejl poslat samo jednom
        Mail::assertSent(GoalNotificationMail::class, 1);
    }
}
