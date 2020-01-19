<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

/**
 * @Route("/api", format="json")
 *
 */
class PanelController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @Route("/panel", name="panel")
     */
    public function index()
    {
        $user = $this->security->getUser();
        return new JsonResponse(['email' => $user->getUsername(), 'roles' => $user->getRoles()]);
    }
}
