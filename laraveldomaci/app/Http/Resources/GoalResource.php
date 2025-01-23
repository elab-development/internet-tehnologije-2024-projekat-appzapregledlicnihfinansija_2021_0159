<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GoalResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'target_amount' => $this->target_amount,
            'current_amount' => $this->current_amount,
            'progress' => $this->progressPercentage(), // Izračunati procenat postignuća cilja
            'user_id' => $this->user,
            'deadline' => $this->deadline ? $this->deadline->format('Y-m-d') : null, // Rok u čitljivom formatu
            'status' => $this->status,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
 
    
    }

    /**
     * Calculate the progress percentage of the goal.
     *
     * @return float|null
     */
    private function progressPercentage(): ?float
    {
        if ($this->target_amount > 0) {
            return round(($this->current_amount / $this->target_amount) * 100, 2);
        }
        return null;
    }
}
