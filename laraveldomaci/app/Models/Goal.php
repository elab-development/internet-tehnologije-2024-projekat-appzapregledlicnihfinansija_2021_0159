<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'target_amount',
        'current_amount',
        'user_id',
        'deadline', // rok za ostvarenje cilja
        'status', // npr. "in_progress", "achieved", "failed"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}