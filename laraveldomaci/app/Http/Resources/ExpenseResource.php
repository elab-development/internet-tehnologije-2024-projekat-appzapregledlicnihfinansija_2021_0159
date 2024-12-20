<?php

namespace App\Http\Resources;

use App\Models\ExpenseCategory;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'description' => $this->description,
            'expense_category_id' => ExpenseCategory::find($this->expense_category_id),
            'category_name' => $this->expenseCategory->name ?? null, // Naziv kategorije
            'user_id' => $this->user,
            'currency' => $this->currency,
            'date' => $this->date->format('Y-m-d'),
            'status' => $this->status,
            'goal_id' => $this->goal_id, // Dodato posle konsultacija
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
