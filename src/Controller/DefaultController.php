<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/{reactRouting}", name="index", requirements={"reactRouting"="^(?!api).+"}, defaults={"reactRouting": null})
     */
    public function indexAction()
    {
        return $this->render('index.html.twig');
    }
}
