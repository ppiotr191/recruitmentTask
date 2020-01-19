<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;


/**
 * @Route("/api", format="json")
 *
 */
class UserController extends AbstractController
{
    const NOT_EXISTS = 'User does not exist';
    const YOU_CANNOT_REMOVE_OWN = 'You cannot remove own account';
    const EMAIL = 'email';
    const PASSWORD = 'password';
    const SUCCESS = 'success';
    const ERRORS = 'errors';
    const ROLES = 'roles';

    private $userRepository;
    private $serializer;

    public function __construct(UserRepository $userRepository, SerializerInterface $serializer)
    {
        $this->userRepository = $userRepository;
        $this->serializer = $serializer;
    }

    /**
     * @Route("/users", methods={"GET"})
     *
     */
    public function index()
    {
        $users = $this->userRepository->findAll();

        $jsonResponse = $this->serializer->serialize($users, 'json',
            [AbstractNormalizer::IGNORED_ATTRIBUTES => ['apiToken', 'password', 'salt']]);
        return JsonResponse::fromJsonString($jsonResponse);
    }

    /**
     * @Route("/users/{id}", methods={"GET"})
     * @param $id
     * @return JsonResponse
     */
    public function getById($id)
    {
        $user = $this->userRepository->find($id);
        if (null === $user) {
            throw $this->createNotFoundException(self::NOT_EXISTS);
        }
        $jsonResponse = $this->serializer->serialize($user, 'json',
            [AbstractNormalizer::IGNORED_ATTRIBUTES => ['apiToken', 'password', 'salt']]);
        return JsonResponse::fromJsonString($jsonResponse);
    }

    /**
     * @Route("/users", methods={"POST"})
     * @return JsonResponse
     */
    public function create(
        Request $request,
        ValidatorInterface $validator,
        UserPasswordEncoderInterface $userPasswordEncoder
    ) {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data[self::EMAIL]);
        $user->setRoles($data[self::ROLES]);
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
        $this->userRepository->save($user);

        $jsonResponse = $this->serializer->serialize($user, 'json',
            [AbstractNormalizer::IGNORED_ATTRIBUTES => ['apiToken', 'password', 'salt']]);
        return JsonResponse::fromJsonString($jsonResponse);
    }

    /**
     * @Route("/users/{id}", methods={"PUT"})
     * @return JsonResponse
     */
    public function update(
        $id,
        Request $request,
        ValidatorInterface $validator,
        UserPasswordEncoderInterface $userPasswordEncoder
    ) {
        $data = json_decode($request->getContent(), true);

        $user = $this->userRepository->find($id);
        if (!$user) {
            throw $this->createNotFoundException(self::NOT_EXISTS);
        }
        $user->setEmail($data[self::EMAIL]);
        $user->setRoles($data[self::ROLES]);


        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorsResponse = [];
            foreach ($errors as $error) {
                $errorsResponse[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse([self::SUCCESS => false, self::ERRORS => $errorsResponse]);
        }

        if (isset($data[self::PASSWORD])) {
            $user->setPassword($data[self::PASSWORD]);
            $user->setPassword($userPasswordEncoder->encodePassword($user, $data[self::PASSWORD]));
        }

        $this->userRepository->save($user);
        $jsonResponse = $this->serializer->serialize($user, 'json',
            [AbstractNormalizer::IGNORED_ATTRIBUTES => ['apiToken', 'password', 'salt']]);
        return JsonResponse::fromJsonString($jsonResponse);
    }

    /**
     * @Route("/users/{id}", methods={"DELETE"})
     * @return JsonResponse
     */
    public function delete($id)
    {
        $user = $this->userRepository->find($id);
        $loggedUser = $this->getUser();

        if (null === $user) {
            throw $this->createNotFoundException(self::NOT_EXISTS);
        }

        if ($user->getId() === $loggedUser->getId()) {
            throw $this->createAccessDeniedException(self::YOU_CANNOT_REMOVE_OWN);
        }
        $this->userRepository->remove($user);
        return new JsonResponse([]);
    }
}
