<?php

namespace App\Controller;


use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegisterController extends AbstractController
{
    const EMAIL = 'email';
    const PASSWORD = 'password';
    const ERRORS = 'errors';
    const SUCCESS = 'success';

    /**
     * @Route("/api/register", name="register")
     */
    public function index(
        Request $request,
        ValidatorInterface $validator,
        UserPasswordEncoderInterface $userPasswordEncoder,
        UserRepository $userRepository
    ) {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data[self::EMAIL]);
        $user->setPassword($data[self::PASSWORD]);

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorsResponse = [];
            foreach ($errors as $error) {
                $errorsResponse[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse([self::SUCCESS => false, self::ERRORS => $errorsResponse]);
        }

        $user->setPassword($userPasswordEncoder->encodePassword($user, $data[self::PASSWORD]));
        $userRepository->save($user);

        return new JsonResponse([self::SUCCESS => true]);
    }
}
