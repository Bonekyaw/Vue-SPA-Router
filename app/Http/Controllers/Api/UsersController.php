<?php

namespace App\Http\Controllers\Api;

use App\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UsersController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::paginate(10));
    }
}
