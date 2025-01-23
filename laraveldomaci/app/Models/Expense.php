<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'description',
        'expense_category_id',
        'user_id',
        'currency',
        'date',
        'status', // npr. "paid", "unpaid"
        'goal_id',  //dodato posle konsultacija
    ];

    public function expenseCategory()
    {
        return $this->belongsTo(ExpenseCategory::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function goal() //dodato posle konsultacija
    {
        return $this->belongsTo(Goal::class);
    }
    protected $casts = [
        'date' => 'date', // Ovo osigurava da se `date` pretvara u Carbon instancu
    ];
}
