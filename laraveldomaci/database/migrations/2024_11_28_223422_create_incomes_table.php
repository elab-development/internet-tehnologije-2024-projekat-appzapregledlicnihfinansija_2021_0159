<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2); // Iznos prihoda (decimalni broj)
            $table->string('description')->nullable(); // Opis prihoda
            $table->unsignedBigInteger('user_id'); // Referenca na korisnika
            $table->string('source')->nullable(); // Izvor prihoda (npr. plata, bonus)
            $table->string('currency', 3)->default('USD'); // Valuta (default USD)
            $table->date('date'); // Datum prihoda
            $table->timestamps();

            // Spoljni ključ
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('incomes');
    }
};
