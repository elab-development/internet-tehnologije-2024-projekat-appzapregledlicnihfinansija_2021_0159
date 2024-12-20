<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'description',
        'user_id',
        'source', // npr. "salary", "bonus", "gift"
        'currency',
        'date',
        'goal_id',  //dodato posle konsultacija
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'date' => 'date', // Ovo osigurava da se `date` pretvara u Carbon instancu
    ];


    public function goal() //dodato posle konsultacija
    {
        return $this->belongsTo(Goal::class);
    }
}
