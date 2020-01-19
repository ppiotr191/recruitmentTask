<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{
    const USERNAME = 'username';
    const EMAIL = 'email';
    const PASSWORD = 'password';
    const API_TOKEN = 'apiToken';
    const ERROR = 'error';
    const INVALID_USER_OR_PASSWORD = 'Invalid user or password';
    const ROLES = 'roles';

    /**
     * @Route("/api/login", name="login")
     */
    public function login(
        Request $request,
        UserRepository $userRepository,
        UserPasswordEncoderInterface $userPasswordEncoder
    ): Response {
        $data = json_decode($request->getContent(), true);

        $user = $userRepository->findOneBy([self::EMAIL => $data[self::USERNAME]]);

        if (null === $user) {
            return new JsonResponse([self::ERROR => self::INVALID_USER_OR_PASSWORD]);
        }

        if ($userPasswordEncoder->isPasswordValid($user, $data[self::PASSWORD])) {
            $apiToken = md5(sprintf("%s%s%s", $user->getEmail(), $user->getPassword(), time()));
            $user->setApiToken($apiToken);
            $userRepository->save($user);
            return new JsonResponse([self::API_TOKEN => $apiToken, self::ROLES => $user->getRoles()]);
        }

        return new JsonResponse([self::ERROR => self::INVALID_USER_OR_PASSWORD]);
    }

    /**
     * @Route("/api/logout", name="app_logout")
     */
    public function logout()
    {

    }
}
