using Backend.Application.DTOs.Answer;
using Backend.Application.DTOs.Question;
using Backend.Domain;
using Backend.Domain.Enums;
using Backend.Domain.Repositories;

namespace Backend.Application.Services;

public class QuestionService
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAnswerRepository _answerRepository;

    public QuestionService(
        IQuestionRepository questionRepository,
        IUserRepository userRepository,
        IAnswerRepository answerRepository)
    {
        _questionRepository = questionRepository;
        _userRepository = userRepository;
        _answerRepository = answerRepository;
    }

    public async Task<IEnumerable<QuestionDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var questions = await _questionRepository.GetAllAsync(cancellationToken);
        return questions.Select(ToDto);
    }

    public async Task<QuestionDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var question = await _questionRepository.GetByIdAsync(id, cancellationToken);
        return question is null ? null : ToDto(question);
    }

    public async Task<IEnumerable<QuestionDto>> GetByAreaAsync(Area area, CancellationToken cancellationToken = default)
    {
        var questions = await _questionRepository.GetByAreaAsync(area, cancellationToken);
        return questions.Select(ToDto);
    }

    public async Task<QuestionDto> CreateAsync(CreateQuestionDto dto, CancellationToken cancellationToken = default)
    {
        if (!Enum.IsDefined(typeof(Area), dto.Area))
        {
            throw new InvalidOperationException($"Área '{dto.Area}' não é válida.");
        }

        if (!await _userRepository.ExistsAsync(dto.AuthorId, cancellationToken))
        {
            throw new InvalidOperationException($"Utilizador com Id '{dto.AuthorId}' não existe.");
        }

        var question = new Question
        {
            Title = dto.Title,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow,
            AuthorId = dto.AuthorId,
            Area = dto.Area
        };

        await _questionRepository.AddAsync(question, cancellationToken);

        var created = await _questionRepository.GetByIdAsync(question.Id, cancellationToken);
        return ToDto(created!);
    }

    public async Task<QuestionDto?> UpdateAsync(Guid id, UpdateQuestionDto dto, CancellationToken cancellationToken = default)
    {
        var question = await _questionRepository.GetByIdAsync(id, cancellationToken);
        if (question is null)
        {
            return null;
        }

        question.Title = dto.Title;
        question.Content = dto.Content;

        await _questionRepository.Update(question, cancellationToken);
        return ToDto(question);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var question = await _questionRepository.GetByIdAsync(id, cancellationToken);
        if (question is null)
        {
            return false;
        }

        await _questionRepository.Delete(question, cancellationToken);
        return true;
    }

    public async Task<QuestionDto?> MarkAcceptedAnswerAsync(Guid questionId, Guid answerId, CancellationToken cancellationToken = default)
    {
        var question = await _questionRepository.GetByIdAsync(questionId, cancellationToken);
        if (question is null)
        {
            throw new KeyNotFoundException($"Pergunta com Id '{questionId}' não encontrada.");
        }

        var answer = await _answerRepository.GetByIdAsync(answerId, cancellationToken);
        if (answer is null)
        {
            throw new KeyNotFoundException($"Resposta com Id '{answerId}' não encontrada.");
        }

        if (answer.QuestionId != questionId)
        {
            throw new InvalidOperationException("A resposta não pertence a esta pergunta.");
        }

        question.AcceptedAnswerId = answerId;
        await _questionRepository.Update(question, cancellationToken);

        var updated = await _questionRepository.GetByIdAsync(questionId, cancellationToken);
        return ToDto(updated!);
    }

    private static QuestionDto ToDto(Question question) => new()
    {
        Id = question.Id,
        Title = question.Title,
        Content = question.Content,
        CreatedAt = question.CreatedAt,
        AuthorId = question.AuthorId,
        AuthorName = question.Author?.Name ?? string.Empty,
        Area = question.Area,
        AcceptedAnswerId = question.AcceptedAnswerId,
        AnswersCount = question.Answers?.Count ?? 0,
        Answers = question.Answers?.Select(ToAnswerDto).ToList() ?? []
    };

    private static AnswerDto ToAnswerDto(Answer answer) => new()
    {
        Id = answer.Id,
        Content = answer.Content,
        CreatedAt = answer.CreatedAt,
        AuthorId = answer.AuthorId,
        AuthorName = answer.Author?.Name ?? string.Empty,
        QuestionId = answer.QuestionId,
        LikesCount = answer.Likes?.Count ?? 0
    };
}