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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2); // Iznos troška
            $table->string('description')->nullable(); // Opis troška
            $table->unsignedBigInteger('expense_category_id'); // Referenca na kategoriju
            $table->unsignedBigInteger('user')->nullable(); // Kolona za korisnika (privremeno ime)
            $table->string('currency', 3)->default('USD'); // Valuta troška
            $table->date('date'); // Datum troška
            $table->enum('status', ['paid', 'unpaid'])->default('unpaid'); // Status troška
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('expenses');
    }
};
