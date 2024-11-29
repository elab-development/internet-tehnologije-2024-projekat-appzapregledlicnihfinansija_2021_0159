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
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Naslov cilja
            $table->text('description')->nullable(); // Opis cilja
            $table->decimal('target_amount', 10, 2); // Ciljani iznos
            $table->decimal('current_amount', 10, 2)->default(0); // Trenutni iznos
            $table->unsignedBigInteger('user_id'); // Referenca na korisnika
            $table->date('deadline')->nullable(); // Rok za ostvarenje cilja
            $table->enum('status', ['in_progress', 'achieved', 'failed'])->default('in_progress'); // Status cilja
            $table->string('notes')->nullable();  
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
        Schema::dropIfExists('goals');
    }
};
