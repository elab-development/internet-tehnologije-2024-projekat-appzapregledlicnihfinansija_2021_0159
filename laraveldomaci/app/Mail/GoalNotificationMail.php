<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GoalNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Kreira novu instancu mail klase.
     *
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Izgradi poruku.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Obaveštenje o napretku cilja')
                    ->view('emails.goalNotification')
                    ->with('data', $this->data);
    }
}
