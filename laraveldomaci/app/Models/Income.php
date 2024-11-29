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
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
